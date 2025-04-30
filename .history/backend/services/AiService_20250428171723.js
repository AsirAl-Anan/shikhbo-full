import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/Chat.model.js";
import Message from "../models/Message.model.js";
import dotenv from "dotenv";
import fs from 'fs';
import cloudinary from 'cloudinary';
import axios from 'axios';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to upload image to cloudinary
const uploadToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'ai-chat-images',
      resource_type: 'auto'
    });
    
    // Note: We're NOT deleting the local file here anymore
    // We'll handle deletion after AI processing is complete
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
};

// Function to read and encode image files
const encodeImageToBase64 = async (imagePath) => {
  // Check if the image path is a URL (Cloudinary) or local file
  if (imagePath.startsWith('http')) {
    const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
    return Buffer.from(response.data).toString('base64');
  } else {
    const imageData = fs.readFileSync(imagePath);
    return Buffer.from(imageData).toString('base64');
  }
};

// Process image for Gemini API
const processImage = async (imagePath) => {
  const mimeType = getImageMimeType(imagePath);
  const base64Image = await encodeImageToBase64(imagePath);
  return {
    inlineData: {
      data: base64Image,
      mimeType: mimeType
    }
  };
};

// Helper function to determine MIME type from file extension or URL
const getImageMimeType = (imagePath) => {
  // If it's a URL, try to determine from the URL
  if (imagePath.startsWith('http')) {
    const extension = imagePath.split('.').pop().split('?')[0].toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    return mimeTypes[extension] || 'image/jpeg';
  } else {
    // For local files
    const extension = imagePath.split('.').pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    return mimeTypes[extension] || 'image/jpeg';
  }
};

// Delete local file safely
const deleteLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Local file deleted: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting local file: ${filePath}`, error);
    // Don't throw error, just log it
  }
};

// AI Response Generator with multimodal support
export const generateAiResponse = async (prompt, imagePath = null) => {
  try {
    const model = await gemini.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });
    
    let result;
    if (imagePath) {
      // Multimodal request with text and image
      const imageData = await processImage(imagePath);
      result = await model.generateContent([prompt, imageData]);
    } else {
      // Text-only request
      result = await model.generateContent(prompt);
    }
    
    const response = result.response;
    const text = response.text();
    return { response: text };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return { 
      response: "Sorry, I couldn't generate a response at this time. The server is too busy, try again later" 
    };
  }
};

// Generate a chat name based on the initial prompt
export const generateChatName = async (prompt) => {
  try {
    const model = await gemini.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });
    const namePrompt = `Generate a very short, concise chat name (maximum 5 words) based on this user query: "${prompt}". Return only the name, with no quotation marks or additional text.`;
    
    const result = await model.generateContent(namePrompt);
    const chatName = result.response.text().trim();
    
    // If the name is too long, truncate it
    return chatName.length > 50 ? chatName.substring(0, 47) + "..." : chatName;
  } catch (error) {
    console.error("Error generating chat name:", error);
    return "New Conversation";
  }
};

// Start a New Chat (with optional image)
export const startNewChat = async (userId, prompt, imagePath = null) => {
  // Create a new chat with default values
  const chat = new Chat({ userId });
  const chatId = chat._id;
  
  console.log("chatId", chatId);
  console.log("userId", userId);
  console.log("prompt", prompt);
  
  if (!chatId || chatId === "null") {
    throw new Error("Invalid chatId");
  }
  
  // Generate a chat name
  const chatName = await generateChatName(prompt);
  chat.chatName = chatName;
  
  let imageUrl = null;
  
  // Step 1: Upload image to Cloudinary if provided
  if (imagePath) {
    console.log("Uploading image to Cloudinary:", imagePath);
    const cloudinaryResult = await uploadToCloudinary(imagePath);
    imageUrl = cloudinaryResult.url;
  }
  
  // Step 2: Create user message with Cloudinary URL
  const userMessage = await Message.create({
    chatId,
    sender: "user",
    text: prompt,
    image: imageUrl
  });
  
  // Step 3: Generate AI response using LOCAL image path (important!)
  // We're still using the local path for AI processing
  const aiResponse = await generateAiResponse(prompt, imagePath);
  
  // Step 4: Create AI message
  const aiMessage = await Message.create({
    chatId,
    sender: "ai",
    text: aiResponse.response,
  });
  
  // Step 5: Save the chat with the generated name
  await chat.save();
  
  // Step 6: NOW we can safely delete the local file after all processing is done
  if (imagePath) {
    deleteLocalFile(imagePath);
  }
  
  return { chatId, chatName, messages: [userMessage, aiMessage] };
};

// Resume Existing Chat (with optional image)
export const continueChat = async (chatId, prompt, imagePath = null) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }
  
  let imageUrl = null;
  
  // Step 1: Upload image to Cloudinary if provided
  if (imagePath) {
    const cloudinaryResult = await uploadToCloudinary(imagePath);
    imageUrl = cloudinaryResult.url;
  }
  
  // Step 2: Create user message with Cloudinary URL
  const userMessage = await Message.create({
    chatId,
    sender: "user",
    text: prompt,
    image: imageUrl
  });
  
  // Step 3: Generate AI response using LOCAL image path
  // We need to use the local image path for AI processing, but store the URL in the database
  const aiResponse = await generateAiResponse(prompt, imagePath);
  
  // Step 4: Create AI message
  const aiMessage = await Message.create({
    chatId,
    sender: "ai",
    text: aiResponse.response,
  });
  
  // Step 5: NOW we can safely delete the local file after all processing is done
  if (imagePath) {
    deleteLocalFile(imagePath);
  }
  
  return { chatId, chatName: chat.chatName, messages: [userMessage, aiMessage] };
};

// Fetch Existing Chat
export const fetchChat = async (chatId) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }
  
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
  
  return { chatId, messages, chatName: chat.chatName };
};

// Upload image to Cloudinary (for the separate upload endpoint)
export const uploadImageToCloud = async (imagePath) => {
  const result = await uploadToCloudinary(imagePath);
  
  // Only delete after the result is successfully returned
  deleteLocalFile(imagePath);
  
  return result;
};
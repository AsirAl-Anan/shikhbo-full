import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/Chat.model.js";
import Message from "../models/Message.model.js";
import dotenv from "dotenv";
dotenv.config();

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Response Generator
export const generateAiResponse = async (prompt) => {
  try {
    const model = await gemini.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return { response: text };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return { response: "Sorry, I couldn't generate a response at this time. The server is too busy, try again later" };
  }
};

// Generate Chat Name
export const generateChatName = async (prompt) => {
  try {
    const model = await gemini.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });
    const chatNamePrompt = `Generate a short, concise title (max 5 words) for a chat that starts with this message: "${prompt}". Return only the title, nothing else.`;
    const result = await model.generateContent(chatNamePrompt);
    const response = result.response;
    let chatName = response.text().trim();
    
    // Ensure the chat name is not too long
    if (chatName.length > 50) {
      chatName = chatName.substring(0, 47) + "...";
    }
    
    return chatName;
  } catch (error) {
    console.error("Error generating chat name:", error);
    return "New Chat";
  }
};

// Start a New Chat
export const startNewChat = async (userId, prompt) => {
  // Generate a chat name using AI
  const chatName = await generateChatName(prompt);
  
  // Create a new chat with the generated name
  const chat = new Chat({ 
    userId,
    chatName
  });
  
  const chatId = chat._id;

  const userMessage = await Message.create({
    chatId,
    sender: "user",
    text: prompt,
  });

  const aiResponse = await generateAiResponse(prompt);

  const aiMessage = await Message.create({
    chatId,
    sender: "ai",
    text: aiResponse.response,
  });

  await chat.save();

  return { chatId, chatName, messages: [userMessage, aiMessage] };
};

// Resume Existing Chat
export const continueChat = async (chatId, prompt) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  const userMessage = await Message.create({
    chatId,
    sender: "user",
    text: prompt,
  });

  const aiResponse = await generateAiResponse(prompt);

  const aiMessage = await Message.create({
    chatId,
    sender: "ai",
    text: aiResponse.response,
  });

  return { chatId, messages: [userMessage, aiMessage] };
};

// Fetch Existing Chat
export const fetchChat = async (chatId) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

  return { chatId, chatName: chat.chatName, messages };
};
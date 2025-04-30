
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

// Start a New Chat
export const startNewChat = async (userId, prompt) => {
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
  
  // Create user message
  const userMessage = await Message.create({
    chatId,
    sender: "user",
    text: prompt,
  });

  // Generate AI response
  const aiResponse = await generateAiResponse(prompt);

  // Create AI message
  const aiMessage = await Message.create({
    chatId,
    sender: "ai",
    text: aiResponse.response,
  });

  // Save the chat with the generated name
  await chat.save();
  userMessage
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

  return { chatId, messages };
};

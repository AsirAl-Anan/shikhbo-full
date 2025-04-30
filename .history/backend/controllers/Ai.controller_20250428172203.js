import {
  startNewChat,
  continueChat,
  fetchChat,
  uploadImageToCloud
} from "../services/AiService.js";
import Chat from "../models/Chat.model.js";

// Start New Chat (API with multimodal support)
export const startChatWithAi = async (req, res) => {
  console.log("startChatWithAi called");
  const userId = req.user._id;
  const { prompt } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    const { chatId, messages, chatName } = await startNewChat(userId, prompt, imagePath);
    res.status(201).json({ chatId, messages, chatName });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ error: "Failed to start chat" });
  }
};

// Resume Chat (API with multimodal support)
export const resumeChatWithAi = async (req, res) => {
  const userId = req.user._id;
  const { prompt } = req.body;
  const chatId = req.params.chatId;
  const imagePath = req.file ? req.file.path : null;

  try {
    const { messages, chatName } = await continueChat(chatId, prompt, imagePath);
    res.status(201).json({ chatId, messages, chatName });
  } catch (error) {
    console.error("Error resuming chat:", error);
    res.status(404).json({ error: error.message });
  }
};

// Get Chat (API)
export const getChatWithAi = async (req, res) => {
  const { chatId } = req.body;
  console.log("chatId", chatId);
  
  try {
    const { messages, chatName } = await fetchChat(chatId);
    res.status(200).json({ chatId, messages, chatName });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(404).json({ error: error.message });
  }
};

// Get All Chats (API)
export const getAllChatWithAi = async (req, res) => {
  const userId = req.user._id;

  try {
    // Modified to include chatName in the projection
    const chats = await Chat.find({ userId }).select('_id chatName createdAt');
    res.status(200).json({ chats });
  } catch (error) {
    console.error("Error fetching all chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

// Upload image only (separate endpoint)
export const uploadImage = async (req, res) => {
  try {
    console.log("Image upload endpoint hasb been called");
    console.log("req.file", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Upload to Cloudinary and get the URL
    // The uploadImageToCloud function now handles local file deletion after processing
    const cloudResult = await uploadImageToCloud(req.file.path);
    
    // Return the cloudinary URL that can be used in subsequent requests
    res.status(200).json({ 
      success: true,
      imageUrl: cloudResult.url,
      publicId: cloudResult.publicId
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
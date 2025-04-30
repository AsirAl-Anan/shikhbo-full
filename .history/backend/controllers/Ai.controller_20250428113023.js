import {
  
    startNewChat,
    continueChat,
    fetchChat,
  } from "../services/AiService.js";
  import Chat from "../models/Chat.model.js";0
  // Start New Chat (API)
  export const startChatWithAi = async (req, res) => {
    const userId = req.user._id;
    const { prompt } = req.body;
  
    try {
      const { chatId, messages } = await startNewChat(userId, prompt);
      res.status(201).json({ chatId, messages });
    } catch (error) {
      console.error("Error starting chat:", error);
      res.status(500).json({ error: "Failed to start chat" });
    }
  };
  
  // Resume Chat (API)
  export const resumeChatWithAi = async (req, res) => {
    const userId = req.user._id;
    const { prompt } = req.body;
    const chatId = req.params.chatId;
  
    try {
      const { messages } = await continueChat(chatId, prompt);
      res.status(201).json({ chatId, messages });
    } catch (error) {
      console.error("Error resuming chat:", error);
      res.status(404).json({ error: error.message });
    }
  };
  
  // Get Chat (API)
  export const getChatWithAi = async (req, res) => {
const { chatId } = req.body;
  console.log("chatId",chatId)
    try {
      const { messages, chatName } = await fetchChat(chatId);
      res.status(200).json({ chatId, messages , chatName});
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(404).json({ error: error.message });
    }
  };
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
  }
}
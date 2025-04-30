import { startNewChat, continueChat } from "../services/aiService.js";

export const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("startChat", async ({ prompt, userId }) => {
      try {
        const { chatId, messages } = await startNewChat(userId, prompt);
        socket.emit("chatStarted", { chatId, messages });
      } catch (error) {
        console.error("Error starting chat via socket:", error);
        socket.emit("error", { message: "Failed to start chat" });
      }
    });

    socket.on("sendMessage", async ({ chatId, prompt }) => {
      try {
        const { messages } = await continueChat(chatId, prompt);
        socket.emit("messageReceived", { chatId, messages });
      } catch (error) {
        console.error("Error sending message via socket:", error);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

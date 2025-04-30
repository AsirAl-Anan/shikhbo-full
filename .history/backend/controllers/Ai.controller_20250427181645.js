import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";
dotenv.config();
import Chat from "../models/Chat.model.js";
import Message from "../models/Message.model.js";
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const generateAiResponse = async (prompt) => {


try {
  
    const model = await gemini.getGenerativeModel({model:"gemini-2.5-flash-preview-04-17"})
    
    const result = await model.generateContent(prompt)
   

    const response = await result.response
    const text = response.text()

     return {response: text}
} catch (error) {
    console.error("Error generating response:", error);
   return { response: "Sorry, I couldn't generate a response at this time." };
}
}


export const startChatWithAi = async( req,res) =>{
    const userId = req.user._id 
    
    const { prompt } = req.body;
  
        const chat = new Chat({
            userId: userId,
        })
        const chatId = chat._id
        const userMessage = await Message.create({
            chatId: chatId,
            sender: "user",
            text: prompt,
        })

        const aiResponse = await generateAiResponse(prompt)
      const aiMessage=   await Message.create({
            chatId: chatId,
            sender: "ai",
            text: aiResponse.response,
        })

        res.status(201).json({ chatId: chat._id, messages: [userMessage, aiMessage] });



        

}
export const resumeChatWithAi = async( req,res) =>{
    console.log("Inside resume test")
    const userId = req.user._id 
    const { prompt } = req.body;
    let chatId = req.params.chatId
  
    const chat = await Chat.findById(chatId)
    if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
       chatId = chat._id
        const userMessage = await Message.create({
            chatId: chatId,
            sender: "user",
            text: prompt,
        })

        const aiResponse = await generateAiResponse(prompt)
        const aiMessage =  await Message.create({
            chatId: chatId,
            sender: "ai",
            text: aiResponse.response,
        })

        res.status(201).json({ chatId, messages: [userMessage, aiMessage] });

}
export const getChatWithAi = async( req,res) =>{ }
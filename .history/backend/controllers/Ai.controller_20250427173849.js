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
    res.status(500).json({ error: "Internal server error" });
}
}


export const chatWithAi = async( req,res) =>{
    const userId = req.user._id 
    const { prompt } = req.body;
    const chat = await Chat.findOne({ userId: userId });
    if(chat){
        const chatId = chat._id
        const message = await Message.create({
            chatId: chatId,
            sender: "user",
            text: prompt,
        })

        const aiResponse = await generateAiResponse(prompt)
        await Message.create({
            chatId: chatId,
            sender: "ai",
            text: aiResponse.response,
        })

        

}
}

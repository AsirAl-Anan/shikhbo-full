import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";
dotenv.config();
import Chat from "../models/Chat.model.js";
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const generateAiResponse = async (req, res) => {
const { prompt } = req.body;

try {
  
    const model = await gemini.getGenerativeModel({model:"gemini-2.5-flash-preview-04-17"})
    const hardcodedPrompt = 'Hello Gemini!'; 
    const result = await model.generateContent(hardcodedPrompt)
   

    const response = await result.response
    const text = response.text()

    res.json({ response: text });
} catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
}
}


export const chatWithAi = async( req,res) =>{
    const userId = req.user._id 
    if(chatExists){

    }
}
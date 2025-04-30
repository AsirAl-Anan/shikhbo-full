import { GoogleGenerativeAI } from "@google/generative-ai";
const gemini = new GoogleGenerativeAi(process.env.GOOGLE_API_KEY);
export const generateResponse = async (req, res) => {
const { prompt } = req.body;
}
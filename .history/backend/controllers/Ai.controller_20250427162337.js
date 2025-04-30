import { GoogleGenerativeAI } from "@google/generative-ai";
const gemini = new GoogleGenerativeAi(process.env.GOOGLE_API_KEY);
export const generateResponse = async (req, res) => {
const { prompt } = req.body;
try {
    const model = 
} catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
}
}
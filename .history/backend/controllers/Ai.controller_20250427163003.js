import { GoogleGenerativeAI } from "@google/generative-ai";
const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
export const generateAiResponse = async (req, res) => {
const { prompt } = req.body;
try {
    console.log("insid")
    const model = await gemini.getGenerativeModel("gemini-2.5-flash-preview-04-17")
    const result = await model.generateContent({
        prompt: prompt,
        temperature: 0.7,
        maxOutputTokens: 1000,
        topP: 0.8,
        topK: 40,
    })

    const response = await result.response
    const text = response.text()

    res.json({ response: text });
} catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
}
}
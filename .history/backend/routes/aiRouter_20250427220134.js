import { Router } from "express";
import { protectedRoute } from "../middlewares/Auth.middleware.js";
import { startChatWithAi } from "../controllers/Ai.controller.js";
import { resumeChatWithAi } from "../controllers/Ai.controller.js";
import { getChatWithAi } from "../controllers/Ai.controller.js";
import { getAllChatWithAi } from "../controllers/Ai.controller.js";
const aiRouter = Router();


aiRouter.post("/chat/query", protectedRoute, startChatWithAi )
aiRouter.post("/chat/:chatId/query", protectedRoute, resumeChatWithAi )
aiRouter.post("/chat/:chatId/getchat", protectedRoute, getChatWithAi )
aiRouter.get("/chat/getAllchat", getAllChatWithAi )


export default aiRouter;
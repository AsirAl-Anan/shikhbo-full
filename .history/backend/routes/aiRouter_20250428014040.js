import { Router } from "express";
import { protectedRoute } from "../middlewares/Auth.middleware.js";
import { startChatWithAi } from "../controllers/Ai.controller.js";
import { resumeChatWithAi } from "../controllers/Ai.controller.js";
import { getChatWithAi } from "../controllers/Ai.controller.js";
import { getAllChatWithAi } from "../controllers/Ai.controller.js";
const aiRouter = Router();


aiRouter.post("/chat/query", protectedRoute, startChatWithAi )
aiRouter.post("/chat/:chatId/query", protectedRoute, resumeChatWithAi )
aiRouter.post("/chat/getChat", protectedRoute, getChatWithAi )
aiRouter.get("/chat/getAllchat", protectedRoute, getAllChatWithAi )


export default aiRouter;
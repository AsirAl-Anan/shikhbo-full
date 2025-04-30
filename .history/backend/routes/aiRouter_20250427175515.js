import { Router } from "express";
import {generateAiResponse} from "../controllers/Ai.controller.js"
import { protectedRoute } from "../middlewares/Auth.middleware.js";
import { startChatWithAi } from "../controllers/Ai.controller.js";
import { resumeChatWithAi } from "../controllers/Ai.controller.js";
const aiRouter = Router();


aiRouter.post("/chat/query", protectedRoute, startChatWithAi )
aiRouter.post("/chat/:chatId/query", protectedRoute, startChatWithAi )


export default aiRouter;
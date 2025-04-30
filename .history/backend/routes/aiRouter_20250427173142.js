import { Router } from "express";
import {generateAiResponse} from "../controllers/Ai.controller.js"
import { protectedRoute } from "../middlewares/Auth.middleware.js";
import { chatWithAi } from "../controllers/Ai.controller.js";
const aiRouter = Router();


aiRouter.post("/chat/query", protectedRoute, chatWithAi )
aiRouter.post("/chat/query", generateAiResponse )

export default aiRouter;
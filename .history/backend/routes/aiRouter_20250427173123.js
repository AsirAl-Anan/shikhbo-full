import { Router } from "express";
import {generateAiResponse} from "../controllers/Ai.controller.js"
import { protectedRoute } from "../middlewares/Auth.middleware.js";
imnport {protectedRoute}
const aiRouter = Router();


aiRouter.post("/chat/query", , generateAiResponse )
aiRouter.post("/chat/query", generateAiResponse )

export default aiRouter;
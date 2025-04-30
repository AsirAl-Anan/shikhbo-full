import { Router } from "express";
import {generateAiResponse} from "../controllers/Ai.controller.js"
const aiRouter = Router();


aiRouter.post("/chat/query", generateAiResponse )
aiRouter.post("/chat/query", generateAiResponse )

export default aiRouter;
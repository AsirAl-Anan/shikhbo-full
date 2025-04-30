import { Router } from "express";
import {generateAiResponse} from "../controllers/Ai.controller.js"
const aiRouter = Router();


aiRouter.post("/generateResponse", responseGenerator )
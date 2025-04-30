import { Router } from "express";
import {generateAiResponse}
const aiRouter = Router();


aiRouter.post("/generateResponse", responseGenerator )
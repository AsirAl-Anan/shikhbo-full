// routes/index.js
import { Router } from "express";
import userRouter from "./User.router.js";
import aiRouter from "./aiRouter.js";

const router = Router();

router.use('/users', userRouter);
router.use('/ai', aiRouter)


export default router;
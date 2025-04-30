// routes/index.js
import { Router } from "express";
import userRouter from "./User.router.js";
import aiRouter from "./aiRouter.js";
import 
const router = Router();

router.use('/users', userRouter);
router.use('/ai', aiRouter)
router.use('/admin', aiRouter)


export default router;
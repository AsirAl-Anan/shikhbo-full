// routes/index.js
import { Router } from "express";
import userRouter from "./User.router.js";


const router = Router();

router.use('/users', userRouter);
router.use('/')


export default router;
import express from "express";
import authRouter from "./auth.routes";
import postRouter from "./post.routes";
import userRouter from "./user.routes";
import likeRouter from "./likes.routes";
import jobsRouter from "./jobs.routes";
import profileRouter from "./profile.routes";
import connectRouter from "./connections.routes";
import { genericErrorHandler } from "../middlewares/errorHandler.middlewares";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/connect", connectRouter);
router.use("/likes", likeRouter);
router.use("/jobs", jobsRouter);
router.use("/profile", profileRouter);

export default router;

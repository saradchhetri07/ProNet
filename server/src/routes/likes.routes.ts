import express from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import { insertLikes } from "../controllers/post.controllers";
import { requestWrapper } from "../utils/requestWrapper.utils";

const router = express.Router();

router.use(authenticate);

router.use("/:postId", requestWrapper(insertLikes));

export default router;

import express from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import { postPost } from "../controllers/post.controllers";
import { upload } from "../middlewares/multer.middlewares";
import { requestWrapper } from "../utils/requestWrapper.utils";

const router = express.Router();

router.use(authenticate);
router.post(
  "/",
  upload.fields([
    {
      name: "postMedia",
      maxCount: 5,
    },
  ]),
  requestWrapper(postPost)
);

export default router;

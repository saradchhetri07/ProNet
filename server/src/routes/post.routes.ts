import express from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import {
  postPost,
  getPosts,
  insertLikes,
  insertComment,
  getComments,
  getMyPosts,
} from "../controllers/post.controllers";
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

router.post("/like/:postId", requestWrapper(insertLikes));
router.post("/comment/:postId", requestWrapper(insertComment));
router.get("/getPosts", requestWrapper(getPosts));
router.get("/comments", requestWrapper(getComments));
router.get("/myPosts", requestWrapper(getMyPosts));
// router.get("/getByRelevance",requestWrapper(getByEmail);

export default router;

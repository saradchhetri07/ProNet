import express from "express";
import { connectRequest } from "../controllers/connection.controllers";
import { acceptRequest } from "../controllers/connection.controllers";
import { authenticate } from "../middlewares/auth.middlewares";
import { requestWrapper } from "../utils/requestWrapper.utils";
import {
  getConnections,
  getRequestedUserInfo,
  deleteConnectionRequest,
  getUserRecommendation,
} from "../controllers/connection.controllers";

const router = express.Router();

router.use(authenticate);
router.get("", requestWrapper(getConnections));
router.post("/accept/:userId", requestWrapper(acceptRequest));
router.get("/requestedUserInfo", requestWrapper(getRequestedUserInfo));
router.post("/:userId", requestWrapper(connectRequest));
router.delete(
  "/reject/:connectUserId",
  requestWrapper(deleteConnectionRequest)
);
router.get("/userRecommendation", requestWrapper(getUserRecommendation));
export default router;

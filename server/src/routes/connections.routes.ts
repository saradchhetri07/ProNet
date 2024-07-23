import express from "express";
import { connectRequest } from "../controllers/connection.controllers";
import { authenticate } from "../middlewares/auth.middlewares";
import { requestWrapper } from "../utils/requestWrapper.utils";

const router = express.Router();

router.use(authenticate);
router.post("/:userId", requestWrapper(connectRequest));

export default router;

import express from "express";
import { getUsers } from "../controllers/user.controllers";
import { requestWrapper } from "../utils/requestWrapper.utils";

const router = express.Router();

router.get("/user", requestWrapper(getUsers));
export default router;

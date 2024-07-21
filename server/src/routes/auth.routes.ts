import express from "express";
import { login, signUp } from "../controllers/auth.controllers";

const router = express();

router.post("/signUp", signUp);
router.post("/login", login);

export default router;

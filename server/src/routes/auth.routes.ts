import {
  loginUserBodySchema,
  signUpUserBodySchema,
} from "./../schema/user.schema";
import express from "express";
import { login, signUp } from "../controllers/auth.controllers";
import { validateReqBody } from "../middlewares/validator.middlewares";
import { upload } from "../middlewares/multer.middlewares";

const router = express();

router.post(
  "/signUp",
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
  ]),
  validateReqBody(signUpUserBodySchema),
  signUp
);
router.post("/login", validateReqBody(loginUserBodySchema), login);

export default router;

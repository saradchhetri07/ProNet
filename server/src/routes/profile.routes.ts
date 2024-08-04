import express from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import {
  createProfile,
  getProfileDetails,
} from "../controllers/profile.controller";
import { requestWrapper } from "../utils/requestWrapper.utils";
import { validateReqBody } from "../middlewares/validator.middlewares";
import { createProfileBodySchema } from "../schema/profile.schema";
import { updateProfile } from "../controllers/profile.controller";

const router = express.Router();

router.use(authenticate);

router.get("/", requestWrapper(getProfileDetails));
router.post(
  "/post",
  validateReqBody(createProfileBodySchema),
  requestWrapper(createProfile)
);
router.patch("/update", requestWrapper(updateProfile));

export default router;

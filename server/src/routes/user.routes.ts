import express from "express";
import {
  getLoggedInUserDetails,
  getUsers,
  updateProfileImage,
  updateCoverImage,
} from "../controllers/user.controllers";
import { requestWrapper } from "../utils/requestWrapper.utils";
import { authenticate } from "../middlewares/auth.middlewares";
import { createUsersProfile } from "../controllers/user.controllers";
import { validateReqBody } from "../middlewares/validator.middlewares";
import { createProfileBodySchema } from "../schema/profile.schema";
import { upload } from "../middlewares/multer.middlewares";

const router = express.Router();

router.use(authenticate);
router.get("/getUsers", requestWrapper(getUsers));
router.get("/me", requestWrapper(getLoggedInUserDetails));
router.post(
  "/profile",
  validateReqBody(createProfileBodySchema),
  requestWrapper(createUsersProfile)
);

router.put(
  "/profileImage",
  upload.fields([
    {
      name: "ProfilePhoto",
      maxCount: 1,
    },
  ]),
  requestWrapper(updateProfileImage)
);

router.put(
  "/coverImage",
  upload.fields([
    {
      name: "CoverPhoto",
      maxCount: 1,
    },
  ]),
  requestWrapper(updateCoverImage)
);

export default router;

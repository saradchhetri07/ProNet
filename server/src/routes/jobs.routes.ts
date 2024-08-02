import express from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import { requestWrapper } from "../utils/requestWrapper.utils";
import { validateReqBody } from "../middlewares/validator.middlewares";
import { createJobBodySchema } from "../schema/jobs.schema";
import { getAllJobs, postJobs } from "../controllers/jobs.controllers";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validateReqBody(createJobBodySchema),
  requestWrapper(postJobs)
);
router.get("/", requestWrapper(getAllJobs));
export default router;

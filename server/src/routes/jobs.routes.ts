import express from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import { requestWrapper } from "../utils/requestWrapper.utils";
import { validateReqBody } from "../middlewares/validator.middlewares";
import { createJobBodySchema } from "../schema/jobs.schema";
import {
  getAllJobs,
  getJobsByFilter,
  postJobs,
} from "../controllers/jobs.controllers";
import { getJobBySearch } from "../controllers/jobs.controllers";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validateReqBody(createJobBodySchema),
  requestWrapper(postJobs)
);
router.get("/", requestWrapper(getAllJobs));
router.get("/filter", requestWrapper(getJobsByFilter));
router.get("/search", requestWrapper(getJobBySearch));
export default router;

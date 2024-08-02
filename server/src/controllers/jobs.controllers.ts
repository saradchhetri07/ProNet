import { NextFunction, Response } from "express";
import HTTPStatusCodes from "http-status-codes";
import { Request } from "../interfaces/auth.interfaces";
import * as JobServices from "../services/job.services";

export const postJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`came to post jobs`);
  const userId = req.user!.id;
  await JobServices.postsJobs(req.body, userId);

  return res.status(HTTPStatusCodes.CREATED).send({ message: "job created" });
};

export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jobs = await JobServices.getAllJobs();
  return res.status(HTTPStatusCodes.OK).json(jobs);
};

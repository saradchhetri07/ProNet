import { NextFunction, Response } from "express";
import HTTPStatusCodes from "http-status-codes";
import { Request } from "../interfaces/auth.interfaces";
import * as JobServices from "../services/job.services";
import { JobFilter } from "../interfaces/job.interfaces";

export const postJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  console.log(`came to post job`, req.body);

  await JobServices.postsJobs(req.body, userId);

  return res.status(HTTPStatusCodes.CREATED).send({ message: "job created" });
};

export const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await JobServices.getAllJobs();
  return res.status(HTTPStatusCodes.OK).json(jobs);
};

export const getJobsByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryType, location, employmentType, salary, experienceLevel } =
    req.query;
  // categoryType: string;
  // location: string;
  // salary: string;
  // employmentType: "Full-time" | "Part-time";
  // experienceLevel?: string;

  const filterBody = {
    categoryType,
    location,
    employmentType,
    salary,
    experienceLevel,
  };
  const userId = req.user!.id;

  const jobs = await JobServices.getJobsByFilter(filterBody, userId);
  return res.status(HTTPStatusCodes.OK).json(jobs);
};

export const getJobBySearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.query;
  console.log("gotten title is", title);

  const jobs = await JobServices.getJobBySearch(title);
  return res.status(HTTPStatusCodes.OK).send(jobs);
};

export const deleteJobById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { jobId } = req.params;
  console.log(`req params is`, jobId);

  await JobServices.deleteJobById(jobId, userId!);
  return res.status(HTTPStatusCodes.OK).send({ message: "Job deleted" });
};

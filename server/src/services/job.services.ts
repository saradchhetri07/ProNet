import { NotFoundError } from "./../errors/NotFound.errors";
import { ServerError } from "../errors/ServerError.errors";
import { Job, JobFilter } from "../interfaces/job.interfaces";
import { JobModel } from "../models/jobs.models";

export const postsJobs = async (JobBody: Job, userId: string) => {
  const jobCreated = JobModel.postsJobs(JobBody, userId);
  if (jobCreated == undefined) {
    throw new ServerError("job creations failed");
  }
  return jobCreated;
};

export const getAllJobs = async () => {
  const jobs = await JobModel.getAllJobs();
  if (jobs?.length === 0) {
    throw new NotFoundError("Jobs not found");
  }
  return jobs;
};

export const getJobsByFilter = async (filter: any, userId: string) => {
  const jobs = await JobModel.getJobByFilter(filter, userId);

  return jobs;
};

export const getJobBySearch = async (title: any) => {
  const jobs = await JobModel.getJobBySearch(title);
  console.log("1");

  return jobs;
};

import { ServerError } from "../errors/ServerError.errors";
import { Job, JobCategory } from "../interfaces/job.interfaces";
import { BaseModel } from "./base.models";

export class JobModel extends BaseModel {
  static async postsJobs(JobBody: Job, userId: string) {
    try {
      `form the frontend`;

      const jobToInsert = {
        ...JobBody,
        userId: userId,
      };
      const jobCreated = await this.queryBuilder()
        .table("jobs_table")
        .insert(jobToInsert);

      return jobCreated;
    } catch (error) {
      throw new ServerError("Internal Server Error");
    }
  }

  static async createJobCategory(JobCategoryBody: JobCategory) {
    try {
      const categoryToCreate = {
        JobCategoryBody,
      };
      const createJobCategory = await this.queryBuilder()
        .table("jobs_table")
        .insert(categoryToCreate);

      return createJobCategory;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }

  static async getAllJobs() {
    try {
      const jobs = await this.queryBuilder().table("jobs_table").select("*");
      return jobs;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }

  static async postJobCategory(category: string) {
    try {
      const postedCategory = await this.queryBuilder().table("job_categories");
    } catch (error) {
      throw new ServerError("Internal Server Error");
    }
  }
}

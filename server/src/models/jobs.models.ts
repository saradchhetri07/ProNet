import { ServerError } from "../errors/ServerError.errors";
import { Job, JobCategory, JobFilter } from "../interfaces/job.interfaces";
import { BaseModel } from "./base.models";

export class JobModel extends BaseModel {
  static async postsJobs(JobBody: Job, userId: string) {
    try {
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

  static async getJobBySearch(jobTitle: string) {
    try {
      const jobs = await this.queryBuilder()
        .table("jobs_table as jobs")
        .join("users", "jobs.user_id", "users.id")
        .select("jobs.*", "users.name", "users.email")
        .where((builder) => {
          builder.andWhere("jobs.title", "ILIKE", `%${jobTitle}%`);
        });

      return jobs;
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error is`, error);
        throw new ServerError(error.message);
      }
    }
  }

  static async getJobByFilter(formData: any, userId: string) {
    try {
      console.log(`form data looks like`, formData);

      let [salaryMin, salaryMax] = formData.salary.split("-").map(Number);

      if (!salaryMax) {
        salaryMax = salaryMin;
      }

      console.log(`salary min and max are`, salaryMin, salaryMax);

      const jobs = await this.queryBuilder()
        .table("jobs_table as jobs")
        .join("users", "jobs.user_id", "users.id")
        .select("jobs.*", "users.name", "users.email")
        .where((builder) => {
          builder
            .andWhere(
              "jobs.categoryType",
              "ILIKE",
              `%${formData.categoryType}%`
            )
            .andWhere("jobs.location", "ILIKE", `%${formData.location}%`)
            .andWhere(
              "jobs.employmentType",
              "ILIKE",
              `%${formData.employmentType}%`
            )
            .andWhere("jobs.salary", ">=", salaryMin)
            .andWhere("jobs.salary", "<=", salaryMax);
          // .andWhere("jobs.user_id", "!=", userId);
        });

      // // .andWhere("jobs.experienceLevel", formData.experienceLevel)
      // .andWhere("jobs.salary", ">=", salaryMin);
      // .andWhere("jobs.salary", "<=", salaryMax);
      // .andWhere("users.id", "!=", userId);

      console.log(`jobs are`, jobs);
      return jobs;
    } catch (error) {
      console.log(`entered into error`);

      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }
}

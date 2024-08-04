import { z, ZodError, ZodSchema } from "zod";
import { isAfterToday } from "../utils/validateDate";

export const editProfileBodySchema = z.object({
  headline: z
    .string({
      required_error: "headline cannot be empty",
      invalid_type_error: "headline must be a string",
    })
    .min(10, "minimum 10 characters headline is required")
    .max(50, "maximum 50 characters headline is allowed"),

  summary: z
    .string({
      required_error: "summary cannot be empty",
      invalid_type_error: "summary must be a string",
    })
    .min(5, "minimum 5 characters headline is required")
    .max(50, "maximum 50 characters summary is allowed"),

  experience: z
    .string({
      required_error: "experience cannot be empty",
      invalid_type_error: "experience must be a string",
    })
    .min(1, "experience cannot be empty"),
  currentCompany: z
    .string({
      required_error: "current company is required",
      invalid_type_error: "current company must be a string",
    })
    .min(1, "current position cannot be empty")
    .max(20, "maximum 20 characters is allowed"),
  currentPosition: z
    .string({
      required_error: "current position is required",
      invalid_type_error: "current position must be a string",
    })
    .min(1, "current position cannot be empty")
    .max(20, "maximum 20 characters is allowed"),
});

export const zodBodySchema = z
  .object({
    title: z
      .string({
        required_error: "title cannot be empty",
        invalid_type_error: "title must be a string",
      })
      .min(5, "Minimum 5 characters required"),
    descriptions: z.string().min(50, "Minimum 50 characters accepted"),
    location: z.string().min(1, "Location cannot be empty"),
    salary: z
      .number({ invalid_type_error: "salary must be number" })
      .finite()
      .positive("Salary greater than 0"),

    employmentType: z.enum(["Full-time", "Part-time"]),

    requiredSkills: z
      .string({
        invalid_type_error: "skills must be a string",
      })
      .optional(),

    experienceLevel: z
      .string({
        invalid_type_error: "experience level must be a string",
      })
      .optional(),

    applicationDeadline: z
      .date({
        required_error: "application deadline cannot be empty",
      })
      .refine((date) => isAfterToday(date), {
        message: "Application deadline must be after today.",
      }),
  })
  .strip();

export function validate(
  Schema: ZodSchema,
  data: z.infer<typeof Schema>,
): ValidationErrors {
  try {
    Schema.parse(data);
    return { success: true, errors: null };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        success: false,
        errors: e.errors.flat().map((err) => {
          return {
            error: err.path[0],
            message: err.message,
          };
        }),
      };
    }
    return { success: false, errors: null };
  }
}

export type ValidationErrors = {
  success: boolean;
  errors: Errors[] | null;
};

export interface Errors {
  error: string | number;
  message: string;
}

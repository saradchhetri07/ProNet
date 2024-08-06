import Joi from "joi";

export const createJobBodySchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Job title is required",
  }),
  description: Joi.string().required().messages({
    "any.required": "Job description is required",
  }),
  location: Joi.string().required().messages({
    "any.required": "Job location is required",
  }),
  salary: Joi.number().positive().optional().messages({
    "number.base": "Salary should be a number",
    "number.positive": "Salary should be a positive number",
  }),
  categoryType: Joi.string().required().messages({
    "any.required": "category is required",
  }),

  employmentType: Joi.string()
    .valid("Full-Time", "Part-Time")
    .required()
    .messages({
      "any.required": "Employment type is required",
      "any.only": "Employment type must be one of 'Full-time', 'Part-time'",
    }),
  requiredSkills: Joi.string().optional().allow("").messages({
    "string.base": "Required skills should be a string",
  }),
  experienceLevel: Joi.string().optional().messages({
    "string.base": "Experience level should be a string",
  }),
  applicationDeadline: Joi.string().required(),
}).options({
  stripUnknown: true, // Remove unknown fields from the input data
});

export const createJobCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Category name is required",
    "string.empty": "Category name must not be empty",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Description should be a string",
  }),
}).options({
  stripUnknown: true, // Remove unknown fields from the input data
});

import Joi from "joi";

export const createProfileBodySchema = Joi.object({
  headline: Joi.string().required().messages({
    "any.required": "Job title is required",
  }),
  summary: Joi.string().required().messages({
    "any.required": "Job description is required",
  }),
  industry: Joi.string().required().messages({
    "string.base": "industry should be a string",
  }),
  website: Joi.string().optional().messages({
    "string.base": "Website should be a string",
  }),
  currentPosition: Joi.string().required().messages({
    "any.required": "Position is required",
    "string.base": "Position should be a string",
  }),
  currentCompany: Joi.string().optional().messages({
    "string.base": "currentCompany should be a string",
  }),
  experience: Joi.string().optional().messages({
    "string.base": "experience should be a string",
  }),
}).options({
  stripUnknown: true, // Remove unknown fields from the input data
});

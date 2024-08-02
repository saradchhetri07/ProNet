import Joi from "joi";

export const createProfileBodySchema = Joi.object({
  headline: Joi.string().required().messages({
    "any.required": "Job title is required",
  }),
  summary: Joi.string().required().messages({
    "any.required": "Job description is required",
  }),
  industry: Joi.string().required().messages({
    "any.required": "Job location is required",
  }),
  website: Joi.string().optional().messages({
    "string.base": "Website should be a string",
  }),
  currentPosition: Joi.string().required().messages({
    "any.required": "Position is required",
    "string.base": "Position should be a string",
  }),
}).options({
  stripUnknown: true, // Remove unknown fields from the input data
});

import Joi from "joi";

export const getUserQuerySchema = Joi.object({
  q: Joi.string().optional(),

  page: Joi.number()
    .optional()
    .messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be greater than or equal to 1",
    })
    .default(1),

  size: Joi.number()
    .min(1)
    .max(10)
    .optional()
    .messages({
      "number.base": "Size must be a number",
      "number.min": "Size must be greater than or equal to 1",
      "number.max": "Size must be less than or equal to 10",
    })
    .default(10),
}).options({
  stripUnknown: true,
});

export const signUpUserBodySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email should be in valid form",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "password is required",
      "string.min": "password should be minimum 8 characters",
      "password.uppercase":
        "at least one password character should be uppercase",
      "password.lowercase":
        "at least one password character should be lowercase",
      "password.specialcharacters":
        "at least one password letter should be uppercaseCharacter",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }
      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }
      if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.specialcharacters");
      }
      return value;
    }),
  photo_url: Joi.string().uri().optional().messages({
    "string.base": "photo_url should be a string",
  }),
  headline: Joi.string().trim().optional().messages({
    "string.base": "headline should be a string",
  }),
  summary: Joi.string().trim().optional().messages({
    "string.base": "summary should be a string",
  }),
  contact_info: Joi.string().optional().messages({
    "string.base": "contact_info should be a string",
  }),
}).options({
  stripUnknown: true,
});

export const loginUserBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email should be in valid form",
  }),
  password: Joi.string().required().messages({
    "any.required": "password is required",
  }),
});

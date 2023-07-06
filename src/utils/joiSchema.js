const Joi = require("joi");

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError =
  "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length";

const joiSchema = {
  signup: Joi.object({
    firstName: Joi.string().required().messages({
      "string.empty": "First name cannot be an empty",
      "any.required": "First name is required",
      "string.base": "First name must be a string",
    }),
    lastName: Joi.string().required().messages({
      "string.empty": "Last name cannot be empty",
      "any.required": "Last name is required",
      "string.base": "Last name must be a string",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email cannot be empty",
      "string.base": "Email must be a string",
      "any.required": "Email is required",
    }),
    password: Joi.string().regex(strongPasswordRegex).required().messages({
      "string.empty": "Password is required",
      "string.pattern.base": stringPassswordError,
    }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{11}$/) // Assuming a 11-digit phone number format
      .required()
      .messages({
        "string.base": "Phone number must be a string",
        "string.pattern.base": "Invalid phone number format",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  email: Joi.object({ email: Joi.string().email().required() }),
  password: Joi.object({ password: Joi.string().min(8).max(20).required() }),
};

module.exports = joiSchema;

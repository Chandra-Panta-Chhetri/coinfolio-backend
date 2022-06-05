import { Joi, Segments } from "celebrate";

const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z]+[.][a-zA-Z]+$/;
const nameRegex = /^[a-zA-Z ]+$/;

export const LOGIN = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex).messages({
      "any.required": "email is required",
      "string.pattern.base": "email must be in the proper format"
    }),
    password: Joi.string().required().messages({
      "any.required": "password is required"
    })
  })
};

export const REGISTER = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex).messages({
      "any.required": "email is required",
      "string.pattern.base": "email must be in the proper format"
    }),
    password: Joi.string().required().messages({
      "any.required": "password is required"
    }),
    name: Joi.string().required().pattern(nameRegex).messages({
      "any.required": "name is required",
      "string.pattern.base": "name must be in the proper format"
    })
  })
};

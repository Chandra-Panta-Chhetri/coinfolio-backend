import { Joi, Segments } from "celebrate";
import ERROR_MESSAGES from "../../../constants/error-messages";
import REGEXES from "../../../constants/regex";

export interface ILoginReqBody {
  email: string;
  password: string;
}

export interface IRegisterReqBody {
  email: string;
  password: string;
  name: string;
}

export const LOGIN = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(REGEXES.EMAIL).messages({
      "any.required": "email is required",
      "string.pattern.base": "email must be in the proper format"
    }),
    password: Joi.string().required().pattern(REGEXES.PASSWORD).messages({
      "any.required": "password is required",
      "string.pattern.base": ERROR_MESSAGES.PASSWORD_FORMAT
    })
  })
};

export const REGISTER = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(REGEXES.EMAIL).messages({
      "any.required": "email is required",
      "string.pattern.base": "email must be in the proper format"
    }),
    password: Joi.string().required().pattern(REGEXES.PASSWORD).messages({
      "any.required": "password is required",
      "string.pattern.base": ERROR_MESSAGES.PASSWORD_FORMAT
    }),
    name: Joi.string().required().pattern(REGEXES.NAME).messages({
      "any.required": "name is required",
      "string.pattern.base": "name must be in the proper format"
    })
  })
};

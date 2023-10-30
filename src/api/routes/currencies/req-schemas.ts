import { Joi, Segments } from "celebrate";

export interface IGetCurrenciesQuery {
  perPage?: number;
  page?: number;
}

export const GET_CURRENCIES = {
  [Segments.QUERY]: Joi.object().keys({
    perPage: Joi.number().default(20).min(1).max(100).messages({
      "number.min": "perPage must be greater than or equal to 1",
      "any.required": "perPage is required",
      "number.max": "perPage cannot be greater than 100"
    }),
    page: Joi.number().default(1).min(1).messages({
      "number.min": "page must be greater than or equal to 1",
      "any.required": "page is required"
    })
  })
};

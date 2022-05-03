import { Joi, Segments } from "celebrate";

export const GET_TOP_COINS = {
  [Segments.QUERY]: Joi.object().keys({
    limit: Joi.number().required().min(1).max(2000).messages({
      "number.min": "limit must be greater than or equal to 1",
      "number.max": "limit must be less than 2000",
      "any.required": "limit is required"
    })
  })
};

export const GET_GAINERS_LOSERS = {
  [Segments.QUERY]: Joi.object().keys({
    limit: Joi.number().required().min(1).max(2000).messages({
      "number.min": "limit must be greater than or equal to 1",
      "number.max": "limit must be less than 2000",
      "any.required": "limit is required"
    })
  })
};

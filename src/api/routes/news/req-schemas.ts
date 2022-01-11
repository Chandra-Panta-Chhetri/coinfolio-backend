import { Joi, Segments } from "celebrate";

export const GET_NEWS = {
  [Segments.QUERY]: Joi.object().keys({
    filter: Joi.string().valid("rising", "hot", "bullish", "bearish", "important", "saved", "lol").messages({
      "any.only": "filter must be 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol'"
    }),
    currencies: Joi.string()
      .pattern(/^[a-zA-Z]+(,[a-zA-Z]+)*$/)
      .messages({
        "string.pattern.base": "currencies must be comma separated values"
      }),
    kind: Joi.string().valid("news", "media").messages({
      "any.only": "kind must be 'news' | 'media'"
    }),
    page: Joi.number().min(1).messages({
      "number.min": "page must be greater than 0",
      "number.base": "page must be a number"
    })
  })
};

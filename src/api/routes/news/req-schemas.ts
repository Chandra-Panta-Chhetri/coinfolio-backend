import { Joi, Segments } from "celebrate";

export const GET_NEWS = {
  [Segments.QUERY]: Joi.object().keys({
    filter: Joi.string().valid("rising", "hot", "bullish", "bearish", "important", "saved", "lol").messages({
      "string.valid": "filter must be 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol'"
    }),
    currencies: Joi.string()
      .pattern(/^[a-zA-Z]+(,[a-zA-Z]+)*$/)
      .messages({
        "string.pattern": "currencies must be comma separated values"
      }),
    kind: Joi.string().valid("news", "media").messages({
      "string.valid": "kind must be 'news' | 'media'"
    })
  })
};

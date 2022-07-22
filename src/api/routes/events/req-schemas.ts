import { Joi, Segments } from "celebrate";
import REGEXES from "../../../constants/regex";

export const GET_EVENTS = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1).messages({
      "number.min": "page must be greater than or equal to 1",
      "number.base": "page must be a number"
    }),
    max: Joi.number().max(75).min(1).messages({
      "number.max": "max must be less than or equal to 75",
      "number.min": "max must be greater than or equal to 1",
      "number.base": "max must be a number"
    }),
    dateRangeStart: Joi.string()
      .pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
      .messages({
        "string.pattern.base": "dateRangeStart must be of the form 'yyyy-mm-dd'"
      }),
    dateRangeEnd: Joi.string()
      .pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
      .messages({
        "string.pattern.base": "dateRangeEnd must be of the form 'yyyy-mm-dd'"
      }),
    showOnly: Joi.string().valid("hot_events", "trending_events", "significant_events").messages({
      "any.only": "showOnly must be 'hot_events' | 'trending_events' | 'significant_events'"
    }),
    coins: Joi.string().pattern(REGEXES.COMMA_SEPARATED).messages({
      "string.pattern.base": "currencies must be comma separated values"
    }),
    sortBy: Joi.string().valid("hot_events", "trending_events", "significant_events").messages({
      "any.only": "sortBy must be 'hot_events' | 'trending_events' | 'significant_events'"
    })
  })
};

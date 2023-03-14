import { Joi, Segments } from "celebrate";

export interface ICreatePortfolioReqBody {
  nickname: string;
}

export interface IUpdatePortfolioReqBody {
  nickname?: string;
  is_deleted?: boolean;
}

export interface IGetTrackableCoinsQuery {
  search?: string;
  limit?: number;
}

export const CREATE_PORTFOLIO = {
  [Segments.BODY]: Joi.object().keys({
    nickname: Joi.string().required().messages({
      "any.required": "nickname is required"
    })
  })
};

export const GET_PORTFOLIO_BY_ID = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().messages({
      "any.required": "id is required"
    })
  })
};

export const GET_PORTFOLIO_OVERVIEW = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().messages({
      "any.required": "id is required"
    })
  })
};

export const UPDATE_PORTFOLIO_BY_ID = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().messages({
      "any.required": "id is required"
    })
  }),
  [Segments.BODY]: Joi.object().keys({
    nickname: Joi.string()
  })
};

export const DELETE_PORTFOLIO_BY_ID = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().messages({
      "any.required": "id is required"
    })
  })
};

export const GET_SUPPORTED_COINS = {
  [Segments.QUERY]: Joi.object().keys({
    search: Joi.string().min(1).messages({
      "string.min": "search must contain at least 1 character"
    }),
    limit: Joi.number().min(1).max(2000).messages({
      "number.min": "limit must be greater than or equal to 1",
      "number.max": "limit must be less than 2000"
    })
  })
};

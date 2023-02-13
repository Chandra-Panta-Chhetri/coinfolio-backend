import { Joi, Segments } from "celebrate";

export interface ICreatePortfolioReqBody {
  nickname: string;
}

export interface IUpdatePortfolioReqBody {
  nickname?: string;
  is_deleted?: boolean;
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

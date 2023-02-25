import { Joi, Segments } from "celebrate";

export interface IGetMarketsQuery {
  sortBy?: string;
  sortOrder?: string;
  perPage?: number;
  page?: number;
}

export interface IGetAssetsQuery {
  search?: string;
  limit?: number;
  offset?: number;
  ids?: string;
}

export interface IGetGainersLosersQuery {
  limit?: number;
}

export interface IGetAssetExchangesQuery {
  perPage?: number;
  page?: number;
}

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

export const GET_ASSETS_BY_KEYWORD = {
  [Segments.QUERY]: Joi.object().keys({
    search: Joi.string().required().messages({
      "any.required": "search is required"
    })
  })
};

export const GET_MARKETS = {
  [Segments.QUERY]: Joi.object().keys({
    sortBy: Joi.string()
      .required()
      .valid("rank", "name", "priceUsd", "marketCapUsd", "volumeUsd24Hr", "changePercent24Hr")
      .messages({
        "any.only":
          "sortBy must be 'rank' | 'name' | 'priceUsd' | 'marketCapUsd' | 'volumeUsd24Hr' | 'changePercent24Hr'",
        "any.required": "sortBy is required"
      }),
    sortOrder: Joi.string().required().valid("ASC", "DESC").messages({
      "any.only": "sortOrder must be 'ASC' | 'DESC'",
      "any.required": "sortOrder is required"
    }),
    perPage: Joi.number().default(10).min(1).max(2000).messages({
      "number.min": "perPage must be greater than or equal to 1",
      "any.required": "perPage is required",
      "number.max": "perPage cannot be greater than 2000"
    }),
    page: Joi.number().default(1).min(1).messages({
      "number.min": "page must be greater than or equal to 1",
      "any.required": "page is required"
    })
  })
};

export const GET_ASSET_OVERVIEW = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().messages({
      "any.required": "asset id is required"
    })
  })
};

export const GET_ASSET_EXCHANGES = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().messages({
      "any.required": "asset id is required"
    })
  }),
  [Segments.QUERY]: Joi.object().keys({
    perPage: Joi.number().default(10).min(1).max(2000).messages({
      "number.min": "perPage must be greater than or equal to 1",
      "any.required": "perPage is required",
      "number.max": "perPage cannot be greater than 2000"
    }),
    page: Joi.number().default(1).min(1).messages({
      "number.min": "page must be greater than or equal to 1",
      "any.required": "page is required"
    })
  })
};

export const GET_ASSET_ABOUT = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().messages({
      "any.required": "asset id is required"
    })
  })
};

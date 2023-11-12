import { Joi, Segments } from "celebrate";
import { IPTransactionType } from "../../../../interfaces/IPortfolio";

export interface IAddPTransactionReqBody {
  notes: string;
  type: string;
  quantity: string;
  pricePer: string;
  coinId: string;
  date: string;
  currencyCode: string;
  usdRate: string;
}

export interface IDeletePTransactionsQuery {
  coinId?: string;
}

export interface IGetPTransactionsQuery {
  coinId?: string;
  type?: IPTransactionType;
}

export interface IUpdatePTransactionReqBody {
  notes?: string;
  type?: IPTransactionType;
  quantity?: string;
  pricePer?: string;
  date?: string;
  currencyCode?: string;
  usdRate?: string;
}

export const ADD_PORTFOLIO_TRANSACTION = {
  [Segments.PARAMS]: Joi.object().keys({
    portfolioId: Joi.string().required().messages({
      "any.required": "portfolioId is required"
    })
  }),
  [Segments.BODY]: Joi.object().keys({
    type: Joi.string().required().valid("buy", "sell", "transfer_in", "transfer_out").messages({
      "any.only": "type must be 'buy' | 'sell' | 'transfer_in' | 'transfer_out'"
    }),
    quantity: Joi.number().required().greater(0).messages({
      "any.required": "quantity is required",
      "number.greater": "quantity must be greater than 0"
    }),
    coinId: Joi.string().required().messages({
      "any.required": "coinId is required"
    }),
    date: Joi.date().iso().messages({
      "date.format": "date must be in ISO format"
    }),
    notes: Joi.string().max(255).messages({
      "string.max": "notes cannot be greater than 255 characters"
    }),
    currencyCode: Joi.string().default("USD").messages({}),
    usdRate: Joi.number().greater(0).default(1).messages({
      "number.greater": "usdRate must be greater than 0"
    }),
    pricePer: Joi.when("type", {
      is: Joi.valid("buy", "sell"),
      then: Joi.number().greater(0).required().messages({
        "number.greater": "pricePer must be greater than 0",
        "any.required": "pricePer is required when type is 'buy' or 'sell'"
      }),
      otherwise: Joi.forbidden().default(0).messages({
        "any.unknown": "pricePer is not allowed when type is 'transfer_in' or 'transfer_out'"
      })
    })
  })
};

export const DELETE_TRANSACTIONS = {
  [Segments.PARAMS]: Joi.object().keys({
    portfolioId: Joi.string().required().messages({
      "any.required": "portfolioId is required"
    })
  }),
  [Segments.QUERY]: Joi.object().keys({
    coinId: Joi.string().messages({})
  })
};

export const GET_TRANSACTIONS = {
  [Segments.PARAMS]: Joi.object().keys({
    portfolioId: Joi.string().required().messages({
      "any.required": "portfolioId is required"
    })
  }),
  [Segments.QUERY]: Joi.object().keys({
    coinId: Joi.string().messages({}),
    type: Joi.string().valid("buy", "sell", "transfer_in", "transfer_out").messages({
      "any.only": "type must be 'buy' | 'sell' | 'transfer_in' | 'transfer_out'"
    })
  })
};

export const UPDATE_TRANSACTION_BY_ID = {
  [Segments.PARAMS]: Joi.object().keys({
    portfolioId: Joi.string().required().messages({
      "any.required": "portfolioId is required"
    }),
    id: Joi.string().required().messages({
      "any.required": "id is required"
    })
  }),
  [Segments.BODY]: Joi.object().keys({
    notes: Joi.string().max(255).messages({
      "string.max": "notes cannot be greater than 255 characters"
    }),
    type: Joi.string().valid("buy", "sell", "transfer_in", "transfer_out").messages({
      "any.only": "type must be 'buy' | 'sell' | 'transfer_in' | 'transfer_out'"
    }),
    quantity: Joi.number().greater(0).messages({
      "number.greater": "quantity must be greater than 0"
    }),
    pricePer: Joi.number().greater(0).messages({
      "number.greater": "pricePer must be greater than 0"
    }),
    date: Joi.date().iso().messages({
      "date.format": "date must be in ISO format"
    }),
    currencyCode: Joi.string(),
    usdRate: Joi.number().greater(0).messages({
      "number.greater": "usdRate must be greater than 0"
    })
  })
};

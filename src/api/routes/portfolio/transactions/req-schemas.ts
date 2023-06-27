import { Joi, Segments } from "celebrate";
import { IPTransactionType } from "../../../../interfaces/IPortfolio";

export interface IAddPTransactionReqBody {
  notes: string;
  type: string;
  quantity: string;
  pricePer: string;
  coinId: string;
  date: string;
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
}

export const ADD_PORTFOLIO_TRANSACTION = {
  [Segments.PARAMS]: Joi.object().keys({
    portfolioId: Joi.string().required().messages({
      "any.required": "portfolioId is required"
    })
  }),
  [Segments.BODY]: Joi.object().keys({
    notes: Joi.string().allow("", null).default("").max(255).messages({
      "string.max": "notes cannot be greater than 255 characters"
    }),
    type: Joi.string().required().valid("buy", "sell", "transfer_in", "transfer_out").messages({
      "any.only": "type must be 'buy' | 'sell' | 'transfer_in' | 'transfer_out'"
    }),
    quantity: Joi.number().required().messages({
      "any.required": "quantity is required"
    }),
    pricePer: Joi.number().required().messages({
      "any.required": "pricePer is required"
    }),
    coinId: Joi.string().required().messages({
      "any.required": "coinId is required"
    }),
    date: Joi.date().optional().iso().messages({
      "date.format": "date must be in ISO format"
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
    notes: Joi.string().allow("", null).default("").max(255).messages({
      "string.max": "notes cannot be greater than 255 characters"
    }),
    type: Joi.string().valid("buy", "sell", "transfer_in", "transfer_out").messages({
      "any.only": "type must be 'buy' | 'sell' | 'transfer_in' | 'transfer_out'"
    }),
    quantity: Joi.number().messages({
      "any.required": "quantity is required"
    }),
    pricePer: Joi.number().messages({
      "any.required": "pricePer is required"
    }),
    date: Joi.date().optional().iso().messages({
      "date.format": "date must be in ISO format"
    })
  })
};

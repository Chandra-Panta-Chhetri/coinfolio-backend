import { Joi, Segments } from "celebrate";

export interface IAddPTransactionReqBody {
  notes: string;
  type: string;
  quantity: number;
  pricePer: number;
  coinId: string;
}

export interface IDeletePTransactionsQuery {
  coin_id?: string;
  portfolio_id?: string | number;
}

export const ADD_PORTFOLIO_TRANSACTION = {
  [Segments.PARAMS]: Joi.object().keys({
    portfolioId: Joi.string().required().messages({
      "any.required": "portfolioId is required"
    })
  }),
  [Segments.BODY]: Joi.object().keys({
    notes: Joi.string().default("").max(255).messages({
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
    coin_id: Joi.string().messages({})
  })
};

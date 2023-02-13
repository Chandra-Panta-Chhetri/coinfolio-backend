export interface IPortfolio {
  nickname: string;
  user: number;
  is_deleted: boolean;
  id: number;
}

export interface IPortfolioDTO {
  nickname: string;
  id: number;
}

export interface IPortfoliosDTO {
  data: IPortfolioDTO[];
}

export enum IPortfolioTransactionType {
  BUY = "buy",
  SELL = "sell",
  TRANSFER_IN = "transfer_in",
  TRANSFER_OUT = "transfer_out"
}

export interface IPortfolioTransaction {
  notes: string;
  id: number;
  type: IPortfolioTransactionType;
  quantity: number;
  date: Date;
  price_per_usd: number;
  coincap_id: string;
  portfolio_id: number;
}

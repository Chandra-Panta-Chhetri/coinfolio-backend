export interface IPortfolio {
  nickname: string;
  user_id: number;
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

export enum IPTransactionType {
  BUY = "buy",
  SELL = "sell",
  TRANSFER_IN = "transfer_in",
  TRANSFER_OUT = "transfer_out"
}

export interface IPTransaction {
  notes: string;
  id: number;
  type: IPTransactionType;
  quantity: number;
  date: Date;
  price_per_usd: number;
  coincap_id: string;
  portfolio_id: number;
}

export interface IPTransactionDTO {
  notes: string;
  id: number;
  type: IPTransactionType;
  quantity: number;
  date: Date;
  pricePerUSD: number;
  coinId: string;
}

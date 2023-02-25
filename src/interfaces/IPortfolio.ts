export interface IPortfolio {
  nickname: string;
  user_id: string | number;
  is_deleted: boolean;
  id: string | number;
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
  id: string | number;
  type: IPTransactionType;
  quantity: string;
  date: string;
  price_per_usd: string;
  coincap_id: string;
  portfolio_id: string | number;
}

export interface IPTransactionDTO {
  notes: string;
  id: number;
  type: IPTransactionType;
  quantity: string;
  date: string;
  pricePerUSD: string;
  coinId: string;
}

export interface IPortfolioHoldingDTO {
  totalCost: string;
  coinId: string;
  amount: string;
  priceUSD: string;
  profitLoss: string;
  totalValue: string;
  avgCost: string;
  coinSymbol: string;
  coinName: string;
  coinURL: string;
}

export interface IPortfolioHolding {
  amount: string;
  total_cost: string;
  coin_id: string;
  avg_cost: string;
}

export interface IPortfolioPieChartDTO {
  coinId: string;
  percent: string;
  coinSymbol: string;
  coinName: string;
  totalValue: string;
}

export interface IPortfolioOverview {
  holdings: IPortfolioHoldingDTO[];
  pieCharts: IPortfolioPieChartDTO[];
  totalValue: string;
  totalProfitLoss: string;
  totalCost: string;
}

export interface IPortfolioStats {
  holdings: IPortfolioHoldingDTO[];
  totalValue: string;
  totalProfitLoss: string;
  totalCost: string;
}

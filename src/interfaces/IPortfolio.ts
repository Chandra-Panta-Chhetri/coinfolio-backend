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
  notes?: string | null;
  id?: string | number;
  type: IPTransactionType;
  quantity: string;
  date?: string;
  price_per?: string | null;
  coincap_id: string;
  portfolio_id: string | number;
  currency_code?: string | null;
  usd_rate?: string | null;
}

export interface IPTransactionDTO {
  notes: string | null;
  id: number;
  type: IPTransactionType;
  quantity: string;
  date: string;
  pricePer: string | null;
  coinId: string;
  currencyCode: string | null;
  usdRate: string | null;
}

export interface IPortfolioHoldingDTO {
  totalCost: string;
  coinId: string;
  amount: string;
  priceUSD: IValueAndPercent;
  profitLoss: IValueAndPercent;
  totalValue: string;
  avgCost: string;
  coinSymbol: string;
  coinName: string;
  coinURL: string;
  totalProceeds: string;
}

export interface IPortfolioHolding {
  amount: string;
  total_cost: string;
  coin_id: string;
  avg_cost: string;
  total_proceeds: string;
}

export interface IPortfolioPieChartDTO {
  coinId: string;
  percent: string;
  coinSymbol: string;
  coinName: string;
  totalValue: string;
}

interface IValueAndPercent {
  value: string;
  percentChange: string;
}

export interface IPortfolioOverview {
  holdings: IPortfolioHoldingDTO[];
  pieCharts: IPortfolioPieChartDTO[];
  totalValue: string;
  totalProfitLoss: IValueAndPercent;
  totalCost: string;
}

export interface IPortfolioStats {
  totalValue: string;
  totalProfitLoss: IValueAndPercent;
  totalCost: string;
}

export interface IPHoldingOverview {
  summary: IPortfolioHoldingDTO;
  transactions: IPTransactionDTO[];
}

export interface ICurrency {
  code: string;
  coincap_id: string;
  currency_symbol?: string | null;
  icon_url?: string | null;
  full_name: string;
}

export interface ICurrencyDTO extends ICurrency {
  rate_usd: string;
}

interface IGetCurrencyRate {
  id: string;
  symbol: string;
  currencySymbol: string;
  type: string;
  rateUsd: string;
}

export interface IGetCurrencyRateRes {
  timestamp: number;
  data: IGetCurrencyRate;
}

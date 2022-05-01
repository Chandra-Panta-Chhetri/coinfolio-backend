interface IMarketTotal {
  marketCapUsd: string;
  exchangeVolumeUsd24Hr: string;
  exchanges: string;
  markets: string;
  assets: string;
}

interface AssetSummary {
  marketCapUsd: string;
}

export interface IMarketsSummaryRes {
  data: {
    marketTotal: IMarketTotal;
    btc: AssetSummary;
    eth: AssetSummary;
  };
}

export interface IMarketsSummaryDTO {
  totalMarketCap: string;
  volume24hr: string;
  numExchanges: string;
  numAssets: string;
  btcDom: string;
  ethDom: string;
}

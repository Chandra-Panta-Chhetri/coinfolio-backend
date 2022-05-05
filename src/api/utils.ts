import config from "../config";

export const toNDecimals = (num: string | number, numDecimals: number = 2): number =>
  Number((Math.round(Number(num) * 100) / 100).toFixed(numDecimals));

export const toDollarString = (num: string | number): string => `$${Math.round(Number(num))}`;

export const toPercentString = (num: string | number): string => `${(Math.round(Number(num) * 100) / 100).toFixed(2)}%`;

export const toMarketImageURL = (symbol: string) => `${config.icons.markets}/${symbol.toLowerCase()}@2x.png`;

export const toEventImageURL = (id: string) => `${config.icons.events}/${id}_small.png`;

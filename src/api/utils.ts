import config from "../config";

export const formatToDollar = (num: string | number): string => `$${Math.round(Number(num))}`;

export const formatToPercent = (num: string | number): string => `${(Math.round(Number(num) * 100) / 100).toFixed(2)}%`;

export const formatToMarketImage = (symbol: string) => `${config.icons.markets}/${symbol.toLowerCase()}@2x.png`;

export const formatToEventImage = (id: string) => `${config.icons.events}/${id}_small.png`;

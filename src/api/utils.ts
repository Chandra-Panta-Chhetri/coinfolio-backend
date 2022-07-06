import config from "../config";
import { IAddSubtractOptions } from "../interfaces/IUtils";

export const toNDecimals = (num: string | number, numDecimals: number = 2): number =>
  Number((Math.round(Number(num) * 100) / 100).toFixed(numDecimals));

export const toDollarString = (num: string | number): string => `$${Math.round(Number(num))}`;

export const toPercentString = (num: string | number): string => `${(Math.round(Number(num) * 100) / 100).toFixed(2)}%`;

export const toMarketImageURL = (symbol: string) => `${config.icons.markets}/${symbol.toLowerCase()}@2x.png`;

export const toEventImageURL = (id: string) => `${config.icons.events}/${id}_small.png`;

export const calculatePercentChange = (final: number, initial: number) => ((final - initial) / initial) * 100;

export const addSubtractTime = (initialDate: Date, options: IAddSubtractOptions): Date => {
  const result = new Date(initialDate);

  result.setMilliseconds(initialDate.getMilliseconds() + (options.milliseconds || 0));
  result.setSeconds(initialDate.getSeconds() + (options.seconds || 0));
  result.setMinutes(initialDate.getMinutes() + (options.minutes || 0));
  result.setHours(initialDate.getHours() + (options.hours || 0));
  result.setDate(initialDate.getDate() + (options.days || 0) + (options.weeks || 0) * 7);
  result.setMonth(initialDate.getMonth() + (options.months || 0));
  result.setFullYear(initialDate.getFullYear() + (options.years || 0));

  return result;
};

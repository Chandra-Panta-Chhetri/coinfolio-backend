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

  options.milliseconds && result.setMilliseconds(result.getMilliseconds() + options.milliseconds);
  options.seconds && result.setSeconds(result.getSeconds() + options.seconds);
  options.minutes && result.setMinutes(result.getMinutes() + options.minutes);
  options.hours && result.setHours(result.getHours() + options.hours);
  options.days && result.setDate(result.getDate() + options.days);
  options.weeks && result.setDate(result.getDate() + options.weeks * 7);
  options.months && result.setMonth(result.getMonth() + options.months);
  options.years && result.setFullYear(result.getFullYear() + options.years);

  return result;
};

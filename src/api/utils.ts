import config from "../config";
import { IAddSubtractOptions } from "../interfaces/IUtils";

export const roundToNDecimals = (num: number | string, numDecimals: number = 2): number =>
  +(Math.round(+(+num + `e+${numDecimals}`)) + `e-${numDecimals}`);

export const formatNum = (num: string | number): string => {
  if (num === "") return num;
  if (Math.abs(+num) < 1) {
    let numOfOs = 0;
    let fractionalNum = String(num).split(".")[1] || "";
    for (let char of fractionalNum) {
      if (char === "0") {
        numOfOs++;
      } else {
        break;
      }
    }
    return `${(+num).toFixed(numOfOs + 3)}`;
  }

  const numAsStr = `${roundToNDecimals(num)}`;

  const splitNum = numAsStr.split(".");
  const wholeNum = splitNum[0] || "0";
  const decimalNum = splitNum[1] || "00";

  const formattedWholeNum = (+wholeNum).toLocaleString("en-US");

  return `${formattedWholeNum}.${decimalNum.substring(0, 2).padEnd(2, "0")}`;
};

export const abbreviateNum = (num: number | string): string => {
  if (+num >= 1e3 && +num < 1e6) return roundToNDecimals(+num / 1e3) + " K";
  if (+num >= 1e6 && +num < 1e9) return roundToNDecimals(+num / 1e6) + " M";
  if (+num >= 1e9 && +num < 1e12) return roundToNDecimals(+num / 1e9) + " Bn";
  if (+num >= 1e12) return roundToNDecimals(+num / 1e12) + " Tr";
  return `${formatNum(num)}`;
};

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

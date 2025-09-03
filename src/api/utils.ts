import { IObject } from "../interfaces/IUtils";

export interface IAddSubtractOptions {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  weeks?: number;
}

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

export const removeUndefinedProperties = (obj: IObject) =>
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "undefined") {
      delete obj[key];
    }
  });

export const formatToDollar = (num: string | number): string => `$${Math.round(Number(num))}`;

export const formatToPercent = (num: string | number): string => `${(Math.round(Number(num) * 100) / 100).toFixed(2)}%`;

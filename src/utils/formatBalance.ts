import BigNumber from "bignumber.js";
import { BIG_TEN } from "./bigNumber";

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (
  amount: BigNumber,
  decimals = 18
): BigNumber => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber();
};

export const getFullDisplayBalance = (
  balance: BigNumber,
  decimals = 18,
  decimalsToAppear?: number
) => {
  return getBalanceAmount(balance, decimals).toFixed(decimalsToAppear || 2);
};

export const getFullDisplayBalance2 = (
  balance: BigNumber,
  decimals = 18,
  decimalsToAppear?: number
) => {
  return `${getBalanceAmount(balance, decimals).div(1000).toFixed(0)}K`;
};

export const formatNumber = (
  number: number,
  minPrecision = 2,
  maxPrecision = 2
) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  };
  return number.toLocaleString(undefined, options);
};

export const shorter = (str: any) =>
  str?.length > 8 ? str.slice(0, 6) + "..." + str.slice(-4) : str;

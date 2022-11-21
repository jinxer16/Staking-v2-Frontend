import multicall from "utils/multicall";
import erc20ABI from "config/abi/erc20.json";
import { getBalanceNumber } from "./formatBalance";

export const getTokenBalance = async (
  account: string,
  tokenAddress: string
) => {
  const calls = [
    {
      address: tokenAddress,
      name: "balanceOf",
      params: [account],
    },
    {
      address: tokenAddress,
      name: "decimals",
    },
  ];
  const [balance, decimal] = await multicall(erc20ABI, calls);
  return getBalanceNumber(balance, decimal);
};

import Contracts from "config/contracts";
import { DEFAULT_CHAIN_ID } from "config";

export const getMulticallAddress = () => {
  return Contracts.multicall[DEFAULT_CHAIN_ID];
};

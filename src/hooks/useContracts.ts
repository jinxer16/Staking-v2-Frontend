import { useMemo } from "react";
import { getERC20Contract, getRewardPoolContract } from "utils/contractHelpers";
import useWeb3Provider from "./useWeb3Provider";

export const useERC20 = (address: string) => {
  const provider = useWeb3Provider();
  return useMemo(
    () => getERC20Contract(address, provider.getSigner()),
    [address, provider.getSigner()]
  );
};

export const useRewardPoolContract = (address: string) => {
  const provider = useWeb3Provider();
  return useMemo(
    () => getRewardPoolContract(address, provider.getSigner()),
    [address, provider]
  );
};

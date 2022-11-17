import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRewardPoolContract } from "./useContracts";

export const useClaim = (poolAddress: string) => {
  const { account } = useWeb3React();
  const rewardPoolContract = useRewardPoolContract(poolAddress);
  const handleClaim = useCallback(async () => {
    try {
      const tx = await rewardPoolContract.getReward();
      const receipt = await tx.wait();
      return receipt.status;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [account, rewardPoolContract]);

  return { onClaim: handleClaim };
};

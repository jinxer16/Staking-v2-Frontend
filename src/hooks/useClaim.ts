import { useCallback } from "react";
import { useRewardPoolContract } from "./useContracts";

export const useClaim = (poolAddress: string) => {
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
  }, [rewardPoolContract]);

  return { onClaim: handleClaim };
};

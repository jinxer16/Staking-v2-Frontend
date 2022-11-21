import { useCallback } from "react";
import { useRewardPoolContract } from "./useContracts";

export const useUnStake = (poolAddress: string) => {
  const rewardPoolContract = useRewardPoolContract(poolAddress);
  const handleUnStake = useCallback(
    async (amount: string) => {
      try {
        const tx = await rewardPoolContract.withdraw(amount);
        const receipt = await tx.wait();
        return receipt.status;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [rewardPoolContract]
  );

  return { onUnStake: handleUnStake };
};

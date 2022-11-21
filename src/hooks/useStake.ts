import { useCallback } from "react";
import { useRewardPoolContract } from "./useContracts";

export const useStake = (poolAddress: string) => {
  const rewardPoolContract = useRewardPoolContract(poolAddress);
  const handleStake = useCallback(
    async (amount: string, value = "") => {
      try {
        const tx = await rewardPoolContract.stake(amount, {
          value: value !== "" ? value : 0,
        });
        const receipt = await tx.wait();
        return receipt.status;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [rewardPoolContract]
  );

  return { onStake: handleStake };
};

import { useCallback } from "react";
import { useDaoDistributorContract } from "./useContracts";

export const useWithdraw = (poolAddress: string) => {
  const daoDistributorContract = useDaoDistributorContract(poolAddress);
  const handleWithdraw = useCallback(
    async (amount: string) => {
      try {
        const tx = await daoDistributorContract.withdraw(amount);
        const receipt = await tx.wait();
        return receipt.status;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [daoDistributorContract]
  );

  return { onWithdraw: handleWithdraw };
};

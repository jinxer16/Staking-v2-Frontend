import { useCallback } from "react";
import { useDaoDistributorContract } from "./useContracts";

export const useDeposit = (poolAddress: string) => {
  const daoDistributorContract = useDaoDistributorContract(poolAddress);
  const handleDeposit = useCallback(
    async (amount: string) => {
      try {
        const tx = await daoDistributorContract.deposit(amount);
        const receipt = await tx.wait();
        return receipt.status;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [daoDistributorContract]
  );

  return { onDeposit: handleDeposit };
};

import { useCallback } from "react";
import { ethers, Contract } from "ethers";

export const useApprove = (tokenContract: Contract, spender: string) => {
  const handleApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.approve(
        spender,
        ethers.constants.MaxUint256
      );
      const receipt = await tx.wait();
      return receipt.status;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [tokenContract, spender]);

  return { onApprove: handleApprove };
};

import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers, Contract } from 'ethers'

export const useApprove = (tokenContract: Contract, spender: string) => {
    const { account } = useWeb3React()
    const handleApprove = useCallback(async () => {
      try {
        const tx = await tokenContract.approve(spender, ethers.constants.MaxUint256)
        const receipt = await tx.wait()
        return receipt.status
      } catch (e) {
        console.error(e)
        return false
      }
    }, [account, tokenContract, spender])
  
    return { onApprove: handleApprove }
}

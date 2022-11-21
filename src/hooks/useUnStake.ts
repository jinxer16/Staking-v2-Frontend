import { useCallback} from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRewardPoolContract } from './useContracts'

export const useUnStake = (poolAddress: string) => {
    const { account } = useWeb3React()
    const rewardPoolContract = useRewardPoolContract(poolAddress)
    const handleUnStake = useCallback(async (amount: string) => {
      try {
        const tx = await rewardPoolContract.withdraw(amount)
        const receipt = await tx.wait()
        return receipt.status
      } catch (e) {
        console.error(e)
        return false
      }
    }, [account, rewardPoolContract])
  
    return { onUnStake: handleUnStake }
}
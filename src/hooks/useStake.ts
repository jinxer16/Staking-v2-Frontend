import { useCallback} from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRewardPoolContract } from './useContracts'

export const useStake = (poolAddress: string) => {
    const { account } = useWeb3React()
    const rewardPoolContract = useRewardPoolContract(poolAddress)
    const handleStake = useCallback(async (amount: string, value = '') => {
      try {
        const tx = await rewardPoolContract.stake(amount, {value: value !== '' ? value : 0})
        const receipt = await tx.wait()
        return receipt.status
      } catch (e) {
        console.error(e)
        return false
      }
    }, [account, rewardPoolContract])
  
    return { onStake: handleStake }
}
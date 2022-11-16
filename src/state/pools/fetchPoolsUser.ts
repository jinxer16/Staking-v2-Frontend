import BigNumber from 'bignumber.js'
import rewardPoolABI from 'config/abi/rewardPool.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import pools from 'config/pools'
import { DEFAULT_CHAIN_ID } from 'config'

export const fetchPoolUserAllowances = async (account: string) => {
    const calls = pools.map((pool) => {
        const poolAddress = pool.address[DEFAULT_CHAIN_ID]
        const stakeTokenAddress = pool.stakeToken[DEFAULT_CHAIN_ID]
        return { address: stakeTokenAddress, name: 'allowance', params: [account, poolAddress]}
    })
    const rawTokenAllowances = await multicall(erc20ABI, calls)
    const parsedTokenAllowances = rawTokenAllowances.map((balance) => {
        return new BigNumber(balance).toJSON()
    })

    return parsedTokenAllowances
}

export const fetchPoolUserStakedBalance = async (account: string) => {
    const calls = pools.map((pool) => {
        const poolAddress = pool.address[DEFAULT_CHAIN_ID]
        return { address: poolAddress, name: 'balanceOf', params: [account]}
    })

    const rawTokenBalances = await multicall(rewardPoolABI, calls)
    const parsedTokenBalances = rawTokenBalances.map((balance) => {
        return new BigNumber(balance).toJSON()
    })

    return parsedTokenBalances
}

export const fetchPoolUserEarned = async (account: string) => {
    const calls = pools.map((pool) => {
        const poolAddress = pool.address[DEFAULT_CHAIN_ID]
        return { address: poolAddress, name: 'earned', params: [account]}
    })

    const rawEarnings = await multicall(rewardPoolABI, calls)
    const parsedEarnings = rawEarnings.map((earnings) => {
        return new BigNumber(earnings).toJSON()
    })

    return parsedEarnings
}

export const fetchPoolUserLastDeposited = async (account: string) => {
    const calls = pools.filter(pool => !pool.isSpecialPool).map((pool) => {
        const poolAddress = pool.address[DEFAULT_CHAIN_ID]
        return { address: poolAddress, name: 'lastDeposits', params: [account]}
    })

    const rawLastDeposits = await multicall(rewardPoolABI, calls)
    const parsedLastDeposits = rawLastDeposits.map((lastDeposited) => {
        return Number(lastDeposited)
    }) as Number[]

    const res : Number[] = [];
    res.push(0);
    parsedLastDeposits.forEach(e => {
        res.push(e)
    })
    return res
}

import BigNumber from "bignumber.js";
import multicall from 'utils/multicall'
import erc20ABI from 'config/abi/erc20.json'
import { LpPoolConfig } from "config/types";
import { getBalanceNumber } from "./formatBalance";

// get token price in QuoteToken
export const getTokenPrice = async (pool: LpPoolConfig, chainId: number) => {

    const calls = [
        {
            address: pool.tokenAddress[chainId],
            name: 'balanceOf',
            params: [pool.lpAddress[chainId]]
        },
        {
            address: pool.quoteTokenAddress[chainId],
            name: 'balanceOf',
            params: [pool.lpAddress[chainId]]
        }
    ]

    const [tokenBalance, quoteTokenBalance] = await multicall(erc20ABI, calls)
    const tokenBalanceInNum = getBalanceNumber(tokenBalance, pool.tokenDecimal)
    const quoteTokenBalanceInNum = getBalanceNumber(quoteTokenBalance, pool.quoteTokenDecimal)
    return quoteTokenBalanceInNum / tokenBalanceInNum
}

// get lp price in QuoteToken
export const getLpPrice = async (pool: LpPoolConfig, chainId: number) => {
    const calls = [
        {
            address: pool.quoteTokenAddress[chainId],
            name: 'balanceOf',
            params: [pool.lpAddress[chainId]]
        },
        {
            address: pool.lpAddress[chainId],
            name: 'totalSupply'
        }
    ]

    const [quoteTokenBalance, lpTotalSupply] = await multicall(erc20ABI, calls)
    const quoteTokenBalanceInNum = getBalanceNumber(quoteTokenBalance, pool.quoteTokenDecimal)
    const lpTotalSupplyInNum = getBalanceNumber(lpTotalSupply, 18)
    return quoteTokenBalanceInNum * 2 / lpTotalSupplyInNum
}

// get burned amount
export const getTokenMarketInfo = async (tokenAddress: string) => {
    const burnAddress1 = '0x000000000000000000000000000000000000dEaD'
    const burnAddress2 = '0x0000000000000000000000000000000000000000'

    const calls = [
        {
            address: tokenAddress,
            name: 'totalSupply'
        },        
        {
            address: tokenAddress,
            name: 'balanceOf',
            params: [burnAddress1]            
        },
        {
            address: tokenAddress,
            name: 'balanceOf',
            params: [burnAddress2]                
        }
    ]

    const [totalSupply, burnAmount1, burnAmount2] = await multicall(erc20ABI, calls)
    const burnAmount = new BigNumber(burnAmount1.toString()).plus(new BigNumber(burnAmount2.toString()))

    return {
        totalSupply: new BigNumber(totalSupply.toString()),
        burnAmount: burnAmount,
        circulateSupply: new BigNumber(totalSupply.toString()).minus(burnAmount)
    }
}


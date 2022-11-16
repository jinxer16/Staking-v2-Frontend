import { BigNumber } from "bignumber.js";
import { Address } from "config/contracts/types"
export enum ConnectorNames {
    Injected = "injected",
    WalletConnect = "walletconnect",
    BSC = "bsc",
  }
export type Login = (connectorId: ConnectorNames) => void;

export interface Config {
    title: string;
    icon: string;
    connectorId: ConnectorNames;
}

export interface PoolConfig {
    name: string,
    isNativePool: boolean,
    isLpPool: boolean,
    isSpecialPool: boolean,
    address: Address,
    stakeToken: Address,
    stakeTokenSymbol: string,
    stakeTokenDecimal: number,
    rewardToken: Address,
    rewardTokenSymbol: string,
    rewardTokenDecimal: number,
    logo: string,
    totalSupply?: BigNumber,
    rewardRate?: BigNumber,
    depositFee?: BigNumber,
    periodFinish?: BigNumber,
    lockingDuration?: number,
    userData?:{
        allowance: BigNumber,
        stakedBalance: BigNumber,
        earned:BigNumber,
        lastDeposited?: number,
    }
}

export interface LpPoolConfig {
    name: string,
    lpAddress: Address,
    tokenSymbol: string,
    tokenAddress: Address,
    tokenDecimal: number,
    quoteTokenSymbol: string,
    quoteTokenAddress: Address,
    quoteTokenDecimal: number
}

export enum QuoteToken {
    'ETH' = 'ETH',
    'USDC' = 'USDC',
    'NYAN' = 'NYAN',
    'ORIO' = 'ORIO',
    'BUSD' = 'BUSD',
    'WBNB' = 'WBNB',
}
import { ethers } from "ethers";
import { DEFAULT_GAS_PRICE } from "config";
import { simpleRpcProvider } from "utils/providers";
import erc20ABI from "config/abi/erc20.json";
import multicallABI from "config/abi/multicall.json";
import rewardPoolABI from "config/abi/rewardPool.json";
import daoDistributorABI from "config/abi/daodistributor.json";
import { getMulticallAddress } from "./addressHelpers";

export const getDefaultGasPrice = () => {
  return DEFAULT_GAS_PRICE;
};

const getContract = (
  abi: any,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getERC20Contract = (
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(erc20ABI, address, signer);
};

export const getMulticallContract = (
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(multicallABI, getMulticallAddress(), signer);
};

export const getRewardPoolContract = (
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(rewardPoolABI, address, signer);
};

export const getDaoDistributorContract = (
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(daoDistributorABI, address, signer);
};

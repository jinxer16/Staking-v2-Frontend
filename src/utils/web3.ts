import Web3 from "web3";
import { HttpProviderOptions } from "web3-core-helpers";
import getRpcUrl from "utils/getRpcUrl";

export const getWeb3NoAccount = (chainId: number) => {
  const RPC_URL = getRpcUrl();
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
    timeout: 10000,
  } as HttpProviderOptions);
  const web3NoAccount = new Web3(httpProvider);
  return web3NoAccount;
};

export const getWeb3WithArchivedNodeProvider = (chainId: number) => {
  const RPC_URL = getRpcUrl();
  const archivedHttpProvider = new Web3.providers.HttpProvider(RPC_URL, {
    timeout: 10000,
  } as HttpProviderOptions);
  return new Web3(archivedHttpProvider);
};

export default getWeb3NoAccount;

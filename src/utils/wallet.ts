// Set of helper functions to facilitate wallet setup

import { BASE_EXPLORER_URL } from "config";
import { toast } from "react-toastify";
import getRpcUrl from "./getRpcUrl";

declare let window: any;
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainId: number) => {
  const provider = window.ethereum;
  if (provider) {
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: "Arbitrum One",
            nativeCurrency: {
              name: "AETH",
              symbol: "AETH",
              decimals: 18,
            },
            rpcUrls: getRpcUrl(),
            blockExplorerUrls: [`${BASE_EXPLORER_URL}/`],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the Rinkeby network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string
) => {
  const tokenAdded = await window.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};

export const switchNetwork = async (chainId: number) => {
  const provider = window.ethereum;
  if (provider) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
          },
        ],
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the Rinkeby network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

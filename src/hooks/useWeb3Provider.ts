import { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { simpleRpcProvider } from "utils/providers";

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useWeb3Provider = () => {
  const { library } = useWeb3React();
  const refEth = useRef(library);
  const [provider, setProvider] = useState(library || simpleRpcProvider);

  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library || simpleRpcProvider);
      refEth.current = library;
    }
  }, [library]);

  return provider;
};

export default useWeb3Provider;

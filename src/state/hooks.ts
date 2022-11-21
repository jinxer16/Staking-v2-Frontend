import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import useRefresh from "hooks/useRefresh";
import { useSelector, useDispatch } from "react-redux";
import { fetchPoolsPublicDataAsync } from "./pools";
import { PoolConfig, QuoteToken } from "config/types";
import { State } from "./types";
import lpPools from "config/lpPools";
import {
  getLpPrice,
  getTokenMarketInfo,
  getTokenPrice,
} from "utils/priceHelpers";
import { DEFAULT_CHAIN_ID, FIBO_TOKEN_ADDRESS } from "config";
import { getBalanceNumber, getDecimalAmount } from "utils/formatBalance";
import axios from "axios";

export const useFetchPublicData = () => {
  const dispatch = useDispatch();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    dispatch(fetchPoolsPublicDataAsync());
  }, [dispatch, slowRefresh]);
};

export const usePools = (): PoolConfig[] => {
  const pools = useSelector((state: State) => state.pools.data);
  return pools;
};

export const usePoolFromName = (name: string): PoolConfig => {
  const pool = useSelector((state: State) =>
    state.pools.data.find((f) => f.name === name)
  );
  return pool!;
};

export const usePoolUser = (name: string) => {
  const pool = usePoolFromName(name);
  return {
    allowance: pool.userData ? pool.userData.allowance : new BigNumber(0),
    stakedBalance: pool.userData
      ? pool.userData.stakedBalance
      : new BigNumber(0),
    earned: pool.userData ? pool.userData.earned : new BigNumber(0),
    lastDeposited:
      pool.userData && pool.userData.lastDeposited
        ? pool.userData.lastDeposited
        : 0,
  };
};

export const useTokenPrice = (
  name: string,
  isLpToken: boolean,
  chainId: number
) => {
  const ethPrice = useETHPrice(chainId);
  const lpPool = lpPools.find((f) => f.name === name);
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const fetchPrice = async (lpPool, isLpToken, chainId) => {
      if (lpPool) {
        if (isLpToken) {
          const res = await getLpPrice(lpPool, chainId);
          setPrice(res);
        } else {
          const res = await getTokenPrice(lpPool, chainId);
          setPrice(res);
        }
      }
    };
    fetchPrice(lpPool, isLpToken, chainId);
  }, [name, isLpToken, chainId, lpPool]);

  if (lpPool?.quoteTokenSymbol === QuoteToken.BUSD) {
    return price;
  } else if (lpPool?.quoteTokenSymbol === QuoteToken.WBNB) {
    return price * ethPrice;
  } else {
    return 1;
  }
};

export const useETHPrice = (chainId: number) => {
  const lpPool = lpPools.find((f) => f.name === QuoteToken.WBNB); // WBNB-BUSD pool
  const [ethPrice, setETHPrice] = useState(0);
  useEffect(() => {
    const fetchPrice = async (lpPool, chainId) => {
      if (lpPool) {
        const res = await getTokenPrice(lpPool, chainId);
        setETHPrice(res);
      }
    };
    fetchPrice(lpPool, chainId);
  }, [chainId, lpPool]);
  return ethPrice;
};

export const useORIOPrice = (chainId: number) => {
  const lpPool = lpPools.find((f) => f.name === QuoteToken.ORIO); // ORIO-BNB pool
  const [orioPrice, setORIOPrice] = useState(0);
  useEffect(() => {
    const fetchPrice = async (lpPool, chainId) => {
      if (lpPool) {
        const res = await getTokenPrice(lpPool, chainId);
        setORIOPrice(res);
      }
    };
    fetchPrice(lpPool, chainId);
  }, [chainId, lpPool]);
  return orioPrice;
};

export const useTokenMarketInfo = (tokenAddress: string) => {
  const [marketInfo, setMarketInfo] = useState({
    totalSupply: new BigNumber(0),
    burnAmount: new BigNumber(0),
    circulateSupply: new BigNumber(0),
  });
  useEffect(() => {
    const fetchMarketInfo = async (tokenAddress) => {
      const res = await getTokenMarketInfo(tokenAddress);
      setMarketInfo(res);
    };

    fetchMarketInfo(tokenAddress);
  }, [tokenAddress]);

  return marketInfo;
};

export const useFIBOTokenMarketInfo = () => {
  const [marketInfo, setMarketInfo] = useState({
    totalSupply: new BigNumber(0),
    burnAmount: new BigNumber(0),
    circulateSupply: new BigNumber(0),
  });
  const fiboTokenAddress = FIBO_TOKEN_ADDRESS;
  useEffect(() => {
    const fetchMarketInfo = async (tokenAddress) => {
      const res = await getTokenMarketInfo(tokenAddress);
      setMarketInfo(res);
    };

    fetchMarketInfo(fiboTokenAddress);
  }, [fiboTokenAddress]);

  return marketInfo;
};

export const useCirculateSupplyInfo = () => {
  const [supply, setSupply] = useState(new BigNumber(0));
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetchSupply = async () => {
      const totalRewardPaid = await axios.post(
        "https://api.thegraph.com/subgraphs/name/liu-zhipeng/tif-rewardpool-subgraph",
        {
          query: `{
                    settingEntities(first: 5) {
                        id
                        totalPaid
                        timestamp
                      }
                  }`,
        }
      );

      if (totalRewardPaid.data.data.settingEntities.length > 0) {
        setSupply(
          new BigNumber(totalRewardPaid.data.data.settingEntities[0].totalPaid)
        );
      }
    };

    fetchSupply();
  }, [slowRefresh]);

  return supply;
};
export const useTotalValue = (): BigNumber => {
  const pools = usePools();
  const ethPrice = useETHPrice(DEFAULT_CHAIN_ID);
  const [totalLocked, setTotalLocked] = useState(new BigNumber(0));

  useEffect(() => {
    const fetchTotalLocked = async (_pools: PoolConfig[]) => {
      let value = new BigNumber(0);
      for (let i = 0; i < _pools.length; i++) {
        const pool = _pools[i];

        // get token price
        const lpPool = lpPools.find((f) => f.name === pool.name);
        let tokenPrice = 0;
        if (lpPool) {
          if (pool.stakeTokenSymbol === QuoteToken.BUSD) {
            tokenPrice = 1;
          } else {
            if (pool.isLpPool) {
              tokenPrice = await getLpPrice(lpPool, DEFAULT_CHAIN_ID);
            } else {
              tokenPrice = await getTokenPrice(lpPool, DEFAULT_CHAIN_ID);
            }

            if (lpPool.quoteTokenSymbol === QuoteToken.WBNB) {
              tokenPrice = tokenPrice * ethPrice;
            }
          }
        } else {
          tokenPrice = 0;
        }

        const totalSupply = pool.totalSupply;
        if (totalSupply) {
          const totalSupplyInNum = getBalanceNumber(
            totalSupply,
            pool.stakeTokenDecimal
          );
          value = value.plus(
            getDecimalAmount(new BigNumber(totalSupplyInNum * tokenPrice))
          );
        }
      }

      setTotalLocked(value);
    };

    fetchTotalLocked(pools);
  }, [pools, ethPrice]);

  return totalLocked;
};

export const useORIOTotalValue = (): BigNumber => {
  const totalPools = usePools();
  const pools = totalPools.filter((pool) => pool.stakeTokenSymbol === "ORIO");

  const ethPrice = useETHPrice(DEFAULT_CHAIN_ID);
  const orioPrice = useTokenPrice("ORIO", false, DEFAULT_CHAIN_ID);

  let value = new BigNumber(0);
  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];

    // get token price
    const lpPool = lpPools.find((f) => f.name === pool.stakeTokenSymbol);
    let tokenPrice = 0;
    if (lpPool) {
      if (pool.stakeTokenSymbol === QuoteToken.BUSD) {
        tokenPrice = 1;
      } else {
        if (pool.isLpPool) {
          tokenPrice = 1;
        } else {
          tokenPrice = orioPrice;
        }

        if (lpPool.quoteTokenSymbol === QuoteToken.WBNB) {
          tokenPrice = tokenPrice * ethPrice;
        }
      }
    } else {
      tokenPrice = 0;
    }

    const totalSupply = pool.totalSupply;
    if (totalSupply) {
      const totalSupplyInNum = getBalanceNumber(
        totalSupply,
        pool.stakeTokenDecimal
      );
      value = value.plus(
        getDecimalAmount(new BigNumber(totalSupplyInNum * tokenPrice))
      );
    }
  }

  return value;
};

export const useFIBOTotalValue = (): BigNumber => {
  const totalPools = usePools();
  const pools = totalPools.filter((pool) => pool.stakeTokenSymbol === "FIBO");

  const ethPrice = useETHPrice(DEFAULT_CHAIN_ID);
  const orioPrice = useTokenPrice("FIBO", false, DEFAULT_CHAIN_ID);

  let value = new BigNumber(0);
  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];
    // get token price
    const lpPool = lpPools.find((f) => f.name === pool.stakeTokenSymbol);
    let tokenPrice = 0;
    if (lpPool) {
      if (pool.stakeTokenSymbol === QuoteToken.BUSD) {
        tokenPrice = 1;
      } else {
        if (pool.isLpPool) {
          tokenPrice = 1;
        } else {
          tokenPrice = orioPrice;
        }

        if (lpPool.quoteTokenSymbol === QuoteToken.WBNB) {
          tokenPrice = tokenPrice * ethPrice;
        }
      }
    } else {
      tokenPrice = 0;
    }

    const totalSupply = pool.totalSupply;
    if (totalSupply) {
      const totalSupplyInNum = getBalanceNumber(
        totalSupply,
        pool.stakeTokenDecimal
      );
      value = value.plus(
        getDecimalAmount(new BigNumber(totalSupplyInNum * tokenPrice))
      );
    }
  }

  return value;
};

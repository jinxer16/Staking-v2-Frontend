import rewardPoolABI from "config/abi/rewardPool.json";
import multicall from "utils/multicall";
import pools from "config/pools";
import { DEFAULT_CHAIN_ID } from "config";
import BigNumber from "bignumber.js";

const fetchPools = async () => {
  const data = await Promise.all(
    pools.map(async (poolConfig) => {
      const poolAddress = poolConfig.address[DEFAULT_CHAIN_ID];

      const calls = [
        {
          address: poolAddress,
          name: "totalSupply",
        },
        {
          address: poolAddress,
          name: "depositFee",
        },
        {
          address: poolAddress,
          name: "periodFinish",
        },
        {
          address: poolAddress,
          name: "rewardRate",
        },
      ];

      const [totalSupply, depositFee, periodFinish, rewardRate] =
        await multicall(rewardPoolABI, calls);

      return {
        ...poolConfig,
        totalSupply: new BigNumber(totalSupply).toJSON(),
        depositFee: new BigNumber(depositFee).toJSON(),
        periodFinish: new BigNumber(periodFinish).toJSON(),
        rewardRate: new BigNumber(rewardRate).toJSON(),
      };
    })
  );

  return data;
};

export default fetchPools;

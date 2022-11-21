import { PoolConfig } from "./types";

const pools: PoolConfig[] = [
  {
    name: "FIBO (no lock)",
    isNativePool: false,
    isLpPool: false,
    isSpecialPool: false,
    address: {
      56: "",
      97: "",
      42161: "",
      137: "0x87431F1BE21dF62096f95C7a51c8eCFD7028C801"
    },
    stakeToken: {
      56: "",
      97: "",
      42161: "",
      137: "0x2b3B16826719bF0B494c8ddebaA5E882093eE37e"
    },
    stakeTokenSymbol: "FIBO",
    stakeTokenDecimal: 18,
    rewardToken: {
      56: "",
      97: "",
      42161: "",
      137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    },
    rewardTokenSymbol: "USDC",
    rewardTokenDecimal: 6,
    logo: "images/farms/fibo.png",
    lockingDuration: 0,
  },
  {
    name: "FIBO (3 month locked)",
    isNativePool: false,
    isLpPool: false,
    isSpecialPool: false,
    address: {
      56: "",
      97: "",
      42161: "",
      137: "0x0Dc36b61beEF584438c648dC8672ad159925bef9"
    },
    stakeToken: {
      56: "",
      97: "",
      42161: "",
      137: "0x2b3B16826719bF0B494c8ddebaA5E882093eE37e"
    },
    stakeTokenSymbol: "FIBO",
    stakeTokenDecimal: 18,
    rewardToken: {
      56: "",
      97: "",
      42161: "",
      137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    },
    rewardTokenSymbol: "USDC",
    rewardTokenDecimal: 6,
    logo: "images/farms/fibo.png",
    lockingDuration: 7776000,
  },
];

export default pools;
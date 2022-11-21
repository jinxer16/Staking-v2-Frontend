import { LpPoolConfig } from "./types";

const lpPools: LpPoolConfig[] = [
  {
    name: "WMATIC",
    lpAddress: {
      56: "", 
      97: "",
      42161: "",
      137: "0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827", // WMATIC-USDC
    },
    tokenSymbol: "WMATIC",
    tokenAddress: {
      56: "",
      97: "",
      42161: "",
      137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    tokenDecimal: 18,
    quoteTokenSymbol: "USDC",
    quoteTokenAddress: {
      56: "",
      97: "",
      42161: "",
      137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    },
    quoteTokenDecimal: 6,
  },
  {
    name: "FIBO",
    lpAddress: {
      56: "",
      97: "",
      42161: "",
      137: "0xcd7593f9002dd012a4e06130ced9034ebd96654e" // FIBO-MATIC
    }, 
    tokenSymbol: "FIBO",
    tokenAddress: {
      56: "",
      97: "",
      42161: "",
      137: "0x2b3B16826719bF0B494c8ddebaA5E882093eE37e"
    },
    tokenDecimal: 18,
    quoteTokenSymbol: "WMATIC",
    quoteTokenAddress: {
      56: "",
      97: "",
      42161: "",
      137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    },
    quoteTokenDecimal: 18,
  },
];

export default lpPools;
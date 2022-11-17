import { LpPoolConfig } from "./types";

const lpPools: LpPoolConfig[] = [
  {
    name: "WBNB",
    lpAddress: {
      56: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16", // WBNB-BUSD
      97: "",
      42161: "",
    },
    tokenSymbol: "WBNB",
    tokenAddress: {
      56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      97: "",
      42161: "",
    },
    tokenDecimal: 18,
    quoteTokenSymbol: "BUSD",
    quoteTokenAddress: {
      56: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      97: "",
      42161: "",
    },
    quoteTokenDecimal: 18,
  },
  {
    name: "ORIO",
    lpAddress: {
      56: "0xAF270888755d2993624Ec3381e93d298F94f7d50",
      97: "",
      42161: "",
    }, // ORIO-BNB
    tokenSymbol: "ORIO",
    tokenAddress: {
      56: "0xa30BAba694b8Fc3524C46edC5af295F55381dc60",
      97: "",
      42161: "",
    },
    tokenDecimal: 18,
    quoteTokenSymbol: "WBNB",
    quoteTokenAddress: {
      56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      97: "",
      42161: "",
    },
    quoteTokenDecimal: 18,
  },
  {
    name: "FIBO",
    lpAddress: {
      56: "0x196e7b3301c801256288ec29f4ed93dd4a47a4a5",
      97: "",
      42161: "",
    }, // FIBO-BNB
    tokenSymbol: "FIBO",
    tokenAddress: {
      56: "0x5067c6e9E6c443372f2E62946273ABbF3Cc2f2B3",
      97: "",
      42161: "",
    },
    tokenDecimal: 9,
    quoteTokenSymbol: "WBNB",
    quoteTokenAddress: {
      56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      97: "",
      42161: "",
    },
    quoteTokenDecimal: 18,
  },
];

export default lpPools;

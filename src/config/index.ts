export const localStorageKey = "accountStatus";
export const BASE_EXPLORER_URL = "https://polygonscan.com";
export const DEFAULT_CHAIN_ID = 137;

export const DEFAULT_GAS_LIMIT = 200000;
export const DEFAULT_GAS_PRICE = 50;
export const NATIVE_TOKEN_ADDRESS =
  "0xa30BAba694b8Fc3524C46edC5af295F55381dc60";
export const NATIVE_TOKEN_SYMBOL = "ORIO";
export const FIBO_TOKEN_ADDRESS = "0x2b3B16826719bF0B494c8ddebaA5E882093eE37e";
export const FIBO_TOKEN_SYMBOL = "FIBO";
export const TOTAL_STAKING_DURATION = 993600; // 115 days = 993600(s)
export const YEAR_DURATION = 31536000; // 365 days = 31536000(s)
export const ORIO_LOGO_URL = "https://boorio.com/images/boorio_coin.jpg";
export const FIBO_LOGO_URL = "https://bscscan.com/token/images/fibswap_32.png";

export const CHAIN_CONFIG = {
  97: {
    name: "Binance Smart Chain Testnet",
    shortName: "BSC Testnet",
    provider: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545/",
      "https://data-seed-prebsc-3-s1.binance.org:8545/",
    ],
    subgraph: "",
    image:
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/bnb.svg",
  },
  42161: {
    name: "Arbitrum One",
    shortName: "Arbitrum",
    provider: ["https://arb1.arbitrum.io/rpc"],
    subgraph: "",
    image:
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/bnb.svg",
  },
  56: {
    name: "Binance Smart Chain Mainnet",
    shortName: "BSC Mainnet",
    provider: ["https://bsc-dataseed1.defibit.io/"],
    subgraph: "",
    image:
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/bnb.svg",
  },
  137: {
    name: "Polygon Mainnet",
    shortName: "Polygon Mainnet",
    provider: ["https://polygon-rpc.com/", "https://rpc.ankr.com/polygon"],
    subgraph: "",
    image: "",
  },
};

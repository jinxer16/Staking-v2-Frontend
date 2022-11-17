import { NETWORK } from "./types";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  multicall: {
    [NETWORK.BSCMainnet]: "0x1ee38d535d541c55c9dae27b12edf090c608e6fb",
    [NETWORK.BSCTestnet]: "0x67ADCB4dF3931b0C5Da724058ADC2174a9844412",
    [NETWORK.Arbitrum]: "0xba8Ec3cE7dD3D6BC6Fb791d7B10D8012874f0Ac6",
  },
};

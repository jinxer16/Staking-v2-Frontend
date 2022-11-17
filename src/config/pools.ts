import { PoolConfig } from "./types";

const pools: PoolConfig[] = [
  {
    name: "ORIO",
    isNativePool: false,
    isLpPool: false,
    isSpecialPool: true,
    address: {
      56: "0xcfd0b902AacFE15e72FB228B05B87eBB334b84d4",
      97: "",
      42161: "",
    },
    stakeToken: {
      56: "0xa30BAba694b8Fc3524C46edC5af295F55381dc60",
      97: "",
      42161: "",
    },
    stakeTokenSymbol: "ORIO",
    stakeTokenDecimal: 18,
    rewardToken: {
      56: "0xa30BAba694b8Fc3524C46edC5af295F55381dc60",
      97: "",
      42161: "",
    },
    rewardTokenSymbol: "ORIO",
    rewardTokenDecimal: 18,
    logo: "images/farms/orio.png",
    lockingDuration: 0,
  },
  {
    name: "ORIO (3 month locked)",
    isNativePool: false,
    isLpPool: false,
    isSpecialPool: false,
    address: {
      56: "0x1d53D304de5Badd36F135152f8A2dCf01513342A",
      97: "",
      42161: "",
    },
    stakeToken: {
      56: "0xa30BAba694b8Fc3524C46edC5af295F55381dc60",
      97: "",
      42161: "",
    },
    stakeTokenSymbol: "ORIO",
    stakeTokenDecimal: 18,
    rewardToken: {
      56: "0xa30BAba694b8Fc3524C46edC5af295F55381dc60",
      97: "",
      42161: "",
    },
    rewardTokenSymbol: "ORIO",
    rewardTokenDecimal: 18,
    logo: "images/farms/orio.png",
    lockingDuration: 7776000,
  },
  {
    name: "FIBO (3 month locked)",
    isNativePool: false,
    isLpPool: false,
    isSpecialPool: false,
    address: {
      56: "0x2Ce135AC4BBa034e87fFDE7123A3F505F27771Ba",
      97: "",
      42161: "",
    },
    stakeToken: {
      56: "0x5067c6e9E6c443372f2E62946273ABbF3Cc2f2B3",
      97: "",
      42161: "",
    },
    stakeTokenSymbol: "FIBO",
    stakeTokenDecimal: 9,
    rewardToken: {
      56: "0x5067c6e9E6c443372f2E62946273ABbF3Cc2f2B3",
      97: "",
      42161: "",
    },
    rewardTokenSymbol: "FIBO",
    rewardTokenDecimal: 9,
    logo: "images/farms/fibo.png",
    lockingDuration: 7776000,
  },
  {
    name: "FIBO (6 month locked)",
    isNativePool: false,
    isLpPool: false,
    isSpecialPool: false,
    address: {
      56: "0x9695B987fdB874CE2aaBd8B48C868a9Be9569b69",
      97: "",
      42161: "",
    },
    stakeToken: {
      56: "0x5067c6e9E6c443372f2E62946273ABbF3Cc2f2B3",
      97: "",
      42161: "",
    },
    stakeTokenSymbol: "FIBO",
    stakeTokenDecimal: 9,
    rewardToken: {
      56: "0x5067c6e9E6c443372f2E62946273ABbF3Cc2f2B3",
      97: "",
      42161: "",
    },
    rewardTokenSymbol: "FIBO",
    rewardTokenDecimal: 9,
    logo: "images/farms/fibo.png",
    lockingDuration: 15552000,
  },
];

export default pools;

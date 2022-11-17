import { PoolConfig } from "config/types";

export interface PoolState {
  data: PoolConfig[];
}

export interface State {
  pools: PoolState;
}

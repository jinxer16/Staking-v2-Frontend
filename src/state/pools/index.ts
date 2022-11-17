import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_CHAIN_ID } from "config";
import pools from "config/pools";
import { PoolConfig } from "config/types";
import { PoolState } from "state/types";
import fetchPools from "./fetchPools";
import {
  fetchPoolUserAllowances,
  fetchPoolUserStakedBalance,
  fetchPoolUserEarned,
  fetchPoolUserLastDeposited,
} from "./fetchPoolsUser";

const initialState: PoolState = { data: [...pools] };

export const poolSlice = createSlice({
  name: "Pools",
  initialState,
  reducers: {
    setPoolsPublicData: (state, action) => {
      const livePoolsData: PoolConfig[] = action.payload;
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find(
          (f) => f.address[DEFAULT_CHAIN_ID] === pool.address[DEFAULT_CHAIN_ID]
        );
        return { ...pool, ...livePoolData };
      });
    },
    setPoolsUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataE1) => {
        const { index } = userDataE1;
        state.data[index] = { ...state.data[index], userData: userDataE1 };
      });
    },
  },
});

export const { setPoolsPublicData, setPoolsUserData } = poolSlice.actions;

export const fetchPoolsPublicDataAsync = () => async (dispatch) => {
  const pools = await fetchPools();
  dispatch(setPoolsPublicData(pools));
};

export const fetchPoolsUserDataAsync = (account) => async (dispatch) => {
  const userPoolAllowances = await fetchPoolUserAllowances(account);
  const userPoolStakedBalances = await fetchPoolUserStakedBalance(account);
  const userPoolEarnings = await fetchPoolUserEarned(account);
  const userLastDeposits = await fetchPoolUserLastDeposited(account);

  const arrayOfUserDataObjects = userPoolAllowances.map(
    (poolAllowance, index) => {
      return {
        index,
        allowance: userPoolAllowances[index],
        stakedBalance: userPoolStakedBalances[index],
        earned: userPoolEarnings[index],
        lastDeposited: userLastDeposits[index],
      };
    }
  );

  dispatch(setPoolsUserData({ arrayOfUserDataObjects }));
};

export default poolSlice.reducer;

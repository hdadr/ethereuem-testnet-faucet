import { createAction, createReducer } from "@reduxjs/toolkit";
import { Network } from "../../constants/testnets";

export const changeNetwork = createAction<Network>("network/change network");
export const changeNetworkFullfilled = createAction<number>("network/change network fullfilled");
export const refreshFaucetBalance = createAction<Network>("network/refresh faucet balance");

export type NetworkState = {
  selectedNetwork: Network | null;
  faucetBalance: number;
  isLoading: boolean;
};

const initialState: NetworkState = {
  selectedNetwork: null,
  faucetBalance: 0,
  isLoading: false,
};

export const networkReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeNetwork, (state, action) => {
      state.isLoading = true;
      state.selectedNetwork = action.payload;
    })
    .addCase(refreshFaucetBalance, (state, action) => {
      state.isLoading = true;
    })
    .addCase(changeNetworkFullfilled, (state, action) => {
      state.isLoading = false;
      state.faucetBalance = action.payload;
    });
});

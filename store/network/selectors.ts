import { AppState } from "../";

export const selectSelectedNetwork = (state: AppState) => state.network.selectedNetwork;
export const selectFaucetBalance = (state: AppState) => state.network.faucetBalance;
export const selectIsLoading = (state: AppState) => state.network.isLoading;

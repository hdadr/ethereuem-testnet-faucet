import { AppState } from "../";

export const selectDonationTxHash = (state: AppState) => state.donate.txHash;
export const selectIsLoading = (state: AppState) => state.donate.isLoading;

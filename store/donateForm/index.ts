import { createAction, createReducer } from "@reduxjs/toolkit";

export const donateFundsToFaucet = createAction<{ signer: any; amount: number }>("donateForm/donate funds to faucet");
export const txSubmittedToNetwork = createAction<string>("donateForm/tx submitted to network");
export const donateTxMined = createAction("donateForm/tx mined");
export const providerError = createAction<string>("donateForm/provider error");

export type DonateFormState = {
  txHash: string | null;
  isLoading: boolean;
  errorMessage: string | null;
};

const initialState: DonateFormState = {
  txHash: null,
  isLoading: false,
  errorMessage: null,
};

// createReducer comes with immer
export const donateFormReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(donateFundsToFaucet, (state) => {
      state.errorMessage = null;
    })
    .addCase(txSubmittedToNetwork, (state, action) => {
      state.isLoading = true;
      state.txHash = action.payload;
    })
    .addCase(donateTxMined, (state) => {
      state.txHash = null;
      state.isLoading = false;
    })
    .addCase(providerError, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });
});

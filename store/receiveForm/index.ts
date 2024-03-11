import { createAction, createReducer } from "@reduxjs/toolkit";
import { Network } from "../../constants/testnets";

export const requestfundsFromFaucet = createAction<{ amount: number; address: string }>("receiveForm/request funds from faucet");
export const sendSignedTxToMempool = createAction<{ signedTx: string; network: Network }>(
  "receiveForm/send signed transaction to the mempool"
);
export const notifyWhenTxMined = createAction<{ txHash: string; network: Network }>("receiveForm/notify whent transaction mined");
export const txMined = createAction("receiveForm/transaction mined notification");
export const txError = createAction("receiveForm/error during tx execution");

export type ReceiveFormState = {
  isLoading: boolean;
};

const initialState: ReceiveFormState = {
  isLoading: false,
};

export const receiveFormReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(requestfundsFromFaucet, (state) => {
      state.isLoading = true;
    })
    .addCase(txMined, (state) => {
      state.isLoading = false;
    })
    .addCase(txError, (state) => {
      state.isLoading = false;
    });
});

import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { combineEpics } from "redux-observable";

import { receiveFormReducer } from "./receiveForm";
import { receiveFormEpics } from "./receiveForm/epics";
import { networkReducer } from "./network";
import { getFaucetBalanceEpic } from "./network/epics";
import { donateToFaucetEpic } from "./donateForm/epics";
import { snackbarReducer } from "./snackbar";
import { donateFormReducer } from "./donateForm";

export const rootEpic = combineEpics(getFaucetBalanceEpic, ...receiveFormEpics, donateToFaucetEpic);
const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    network: networkReducer,
    receive: receiveFormReducer,
    donate: donateFormReducer,
    snackbar: snackbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(epicMiddleware),
});

export type AppState = ReturnType<typeof store.getState>;

epicMiddleware.run(rootEpic);

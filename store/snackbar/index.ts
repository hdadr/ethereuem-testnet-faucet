import { createAction, createReducer } from "@reduxjs/toolkit";
import { AppState } from "../";

export const showSnackbar = createAction<SnackbarState>("snackbar/show snackbar");
export const hideSnackbar = createAction("snackbar/hide snackbar");

export const selectSnackbarState = (state: AppState) => state.snackbar;

export type SnackbarState = {
  show: boolean;
  target: string | null;
  content: JSX.Element | null;
};

const initialState: SnackbarState = {
  show: false,
  target: null,
  content: null,
};

export const snackbarReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(showSnackbar, (state, action) => {
      state.show = true;
      state.target = action.payload.target;
      state.content = action.payload.content;
    })
    .addCase(hideSnackbar, (state) => {
      state.show = false;
    });
});

import { AppState } from "../";

export const selectIsLoading = (state: AppState) => state.receive.isLoading;

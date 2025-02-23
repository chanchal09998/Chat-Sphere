import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./CombineReducers";

export const store = configureStore({
  reducer: rootReducer,
});

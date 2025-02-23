import { combineReducers } from "redux";
import { themeReducer } from "./ToggleThemeReducer";

export const rootReducer = combineReducers({
  theme: themeReducer,
});

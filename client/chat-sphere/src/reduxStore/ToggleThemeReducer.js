import { TOGGLE_THEME } from "./ActionCreator";

const initialValue = false; // Default theme is light (false)

export const themeReducer = (state = initialValue, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return !state;
    default:
      return state;
  }
};

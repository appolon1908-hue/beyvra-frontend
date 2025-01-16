import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface ThemeState {
    themeSelect: string;
}

// Define the initial state using that type
const initialState: ThemeState = {
  themeSelect: "night",
};

export const themeBackgroundSlice = createSlice({
  name: "backgroundTheme",
  initialState,
  reducers: {
    setBgTheme: (state, action: PayloadAction<string>) => {
      state.themeSelect = action.payload;
      return state;
    },
  },
});

export const { setBgTheme } = themeBackgroundSlice.actions;

export default themeBackgroundSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface AppProps {
  togglePortfolioWindow: boolean;
}

const initialState: AppProps = {
  togglePortfolioWindow: false
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPortfolioWindow: (state, action: PayloadAction<boolean>) => {
        console.log("clicked toggle")
      state.togglePortfolioWindow = action.payload
    },
  
  },
});

export const { setPortfolioWindow } = appSlice.actions;

export default appSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CryptoSliceState } from "./types";
import { dateFormter } from "helpers/dateFormter";

const initialState: CryptoSliceState = {
  crypto: {
    "BTC/USD": [],
  },
  assets: "cryptoIcon.svg",
  status: "idle",
  start: dateFormter(new Date()),
  timeFrame: "minute",
  currentSymbol: "BTC/USD",
  symbol: "BTC/USD",
  wsRoom: "BTC_USD",
  error: null,
};
  
export const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    setInitialCrypto: (state, action) => {
      state.crypto = { ...state.crypto, ...action.payload };
      return state;
    },
    setCrypto: (state, action) => {
      if (action.payload && action.payload.symbol) {
        const { symbol } = action.payload;
        state.crypto = {
          ...state.crypto,
          [symbol]: [...(state.crypto[symbol] || []), action.payload],
        };
      }
      return state;
    },
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
      state.wsRoom = action.payload.split("/").join("_");
      return state;
    },
    // setAssets: (state, {payload}) => {
    //   state.assets = [...state.assets, ...payload];
    //   return state
    // },
    setAssets: (state, action) => {
      state.assets = action.payload;
      return state
    },
    setCurrentSymbol: (state, action: PayloadAction<string>) => {
      state.currentSymbol = action.payload;
      return state;
    }
  },
});

export const { setInitialCrypto, setCrypto, setAssets, setSymbol, setCurrentSymbol } =
  cryptoSlice.actions;

export default cryptoSlice.reducer;

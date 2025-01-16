import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export type CryptoStockDataType = {
  T: string;
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number;
};

interface WalletSliceState {
  cryptoData: CryptoStockDataType[];
  stockData: CryptoStockDataType[];
  current_balance: number;
  profit_loss: number;
  onlinetraders: number;
  chartSymbol: string;
}

const initialState: WalletSliceState = {
  cryptoData: [],
  stockData: [],
  current_balance: 0,
  profit_loss: 0,
  onlinetraders: 0,
  chartSymbol: "",
};

export const socketStockCryptoSlice = createSlice({
  name: "socketStockCrypto",
  initialState,
  reducers: {
    setCryptoData: (state, action: PayloadAction<Data[]>) => {
      state.cryptoData = action.payload;
      return state;
    },
    setStockData: (state, action: PayloadAction<Data[]>) => {
      state.stockData = action.payload;
      return state;
    },
    setCurrentBalance: (state, action: PayloadAction<number>) => {
      state.current_balance = action.payload;
      return state;
    },
    setProfitLoss: (state, action: PayloadAction<number>) => {
      state.profit_loss = action.payload;
      return state;
    },
    setOnlinetraders: (state, action: PayloadAction<number>) => {
      state.onlinetraders = action.payload;
      return state;
    },
    setChartSymbol: (state, action: PayloadAction<string>) => {
      state.chartSymbol = action.payload;
      return state;
    },
  },
});

export const {
  setCryptoData,
  setStockData,
  setCurrentBalance,
  setProfitLoss,
  setOnlinetraders,
  setChartSymbol,
} = socketStockCryptoSlice.actions;

export default socketStockCryptoSlice.reducer;

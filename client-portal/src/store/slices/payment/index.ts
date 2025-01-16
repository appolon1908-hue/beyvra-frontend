import IPaymentType from "@interfaces/IPaymentType";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface WalletSliceState {
  amount: number;
  walletId: string | null;
  selectedTransactionId: string | null;
  selectedPaymentMethod: IPaymentType | null;
  paymentMethodList: IPaymentType[] | null,

}

const initialState: WalletSliceState = {
  amount: 0,
  walletId: null,
  selectedTransactionId: null,
  paymentMethodList:null,
  selectedPaymentMethod: null

};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
      return state;
    },
    setPaymentMethod: (state, action: PayloadAction<IPaymentType | null>) => {
      state.selectedPaymentMethod = action.payload;
      return state;
    },
    setPaymentMethodList: (state, action: PayloadAction<IPaymentType[] | null>) => {
      state.paymentMethodList = action.payload;
      return state;
    },
    setWalletId: (state, action: PayloadAction<string>) => {
      state.walletId = action.payload;
      return state;
    },
    setTransactionId: (state, action: PayloadAction<string | null>) => {
      state.selectedTransactionId = action.payload;
      return state;
    },
  },
});

export const { setPaymentAmount, setWalletId, setTransactionId, setPaymentMethod, setPaymentMethodList } =
  paymentSlice.actions;

export default paymentSlice.reducer;

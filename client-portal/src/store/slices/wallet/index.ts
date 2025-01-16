import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IWallet, IWalletType } from "@interfaces";
import { InitialAccountsList, InitialAccountsListProps } from "pages/private/platform/platformMenus/add-account/constants";

export interface WalletData {
  account_type?: number;
  name?: string;
  user?: number;
  updated_at?: string;
  currency?:any;
  is_archived?: boolean;
  id?: number;
  created_at?: string;
  balance?: number;
  available_balance?: number;
}

export interface WalletSliceState {
  wallets: WalletData[];
  walletsLoading: boolean;
  selectedWallet?: IWallet;
  editableWallet?: WalletData;
  walletTypes: IWalletType[];
  createWalletData?: WalletData;
  walletToTransferFrom: InitialAccountsListProps;
  walletToTransferTo: InitialAccountsListProps;
}

const initialState: WalletSliceState = {
  wallets: [],
  walletsLoading: false,
  editableWallet: {},
  walletTypes: [],
  walletToTransferFrom: InitialAccountsList[0],
  walletToTransferTo: {}
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<WalletData[]>) => {
      state.wallets = [...action.payload];
      state.walletsLoading = false;
      return state;
    },
    updateWalletsArray: (state, action:  PayloadAction<WalletData>) => {
      let walletsArray: Array<WalletData>  = [...state.wallets];
      walletsArray = walletsArray.map((obj) => {
          if (Number(obj.id) === action?.payload?.id) {
              return action?.payload;
          }

          return obj;
      });
      state.wallets = [...walletsArray];
      return state;
    },
    setWalletsLoading: (state, action: PayloadAction<boolean>) => {
      state.walletsLoading = action.payload;
      return state;
    },
    setSelectedWallet: (state, action: PayloadAction<IWallet | undefined>) => {
      state.selectedWallet = action.payload;
      return state;
    },
    setEditableWallet: (state, action: PayloadAction<WalletData | undefined>) => {
      state.editableWallet = action.payload;
      return state;
    },
    setWalletTypes: (state, action: PayloadAction<IWalletType[]>) => {
      state.walletTypes = [...action.payload];
      return state;
    },
    setWalletToTransferFrom: (state, action: PayloadAction<InitialAccountsListProps>) => {
      state.walletToTransferFrom = action.payload;
      return state;
    },
    setWalletToTransferTo: (state, action: PayloadAction<InitialAccountsListProps>) => {
      state.walletToTransferTo =  action.payload;
      return state;
    },
    setCreateWalletData: (state, action: PayloadAction<WalletData>) => {
      return {
        ...state,
        createWalletData: { ...state.createWalletData, currency: action.payload?.currency }
      };
    },
  },
});

export const {
  setWallets,
  setWalletsLoading,
  setSelectedWallet,
  setWalletToTransferFrom,
  setWalletToTransferTo,
  setWalletTypes,
  setCreateWalletData,
  setEditableWallet,
  updateWalletsArray
} = walletSlice.actions;

export default walletSlice.reducer;

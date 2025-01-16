import { configureStore } from "@reduxjs/toolkit";
import {
  userReducer,
  marketsReducer,
  globalReducer,
  walletReducer,
  paymentReducer,
  tradeReducer,
  assetPairReducer,
  themeBackgroundReducer,
  notificationReducer,
  appReducer,
  socketStockCryptoReducer,
} from "@slices";
import userBio from "./slices/userBio";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    trades: tradeReducer,
    user: userReducer,
    markets: marketsReducer,
    wallet: walletReducer,
    payment: paymentReducer,
    assetPair: assetPairReducer,
    themeBg: themeBackgroundReducer,
    notification: notificationReducer,
    userBio: userBio,
    app: appReducer,
    socketStockCrypto: socketStockCryptoReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

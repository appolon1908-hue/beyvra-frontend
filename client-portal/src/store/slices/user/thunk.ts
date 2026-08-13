import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserSliceState } from ".";
import { beyvraProfileApi } from "api/generated/beyvra";

// Thunks
export const fetctUser = createAsyncThunk(
  "users/fetchById",
  async (token: string) => {
    return { data: await beyvraProfileApi.legacyProfile(token) };
  }
);

// Thunk handlers
export const handlers = {
  user: {
    pending: (state: UserSliceState) => {
      return { ...state, loading: true };
    },
    success: (state: UserSliceState, action: PayloadAction | any) => {
      return { ...state, loading: false, user: action.payload.data };
    },
    rejected: (state: UserSliceState) => {
      return { ...state, loading: false };
    },
  },
};

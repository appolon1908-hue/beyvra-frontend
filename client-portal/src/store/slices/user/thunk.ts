import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserSliceState } from ".";
import { getApiUrl } from "utils/env";

// Thunks
export const fetctUser = createAsyncThunk(
  "users/fetchById",
  async (token: string) => {
    const response = await fetch(getApiUrl("user/profile/"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load user profile");
    return { data: await response.json() };
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

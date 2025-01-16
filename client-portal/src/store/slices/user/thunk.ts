import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserSliceState } from ".";

// Thunks
export const fetctUser = createAsyncThunk(
  "users/fetchById",
  async (userId: number) => {
    // EXAMPLE - IF WE FETCH
    const response = await fetch(`https://reqres.in/api/users/${userId}`);
    return await response.json();
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

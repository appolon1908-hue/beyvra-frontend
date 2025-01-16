import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@interfaces";
import { fetctUser, handlers } from "./thunk";

// Define a type for the slice state
export interface UserSliceState {
  user: IUser | null;
  loading: boolean;
  wsTicket: string | null;
}

// Define the initial state using that type
const initialState: UserSliceState = {
  user: {},
  loading: true,
  wsTicket: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
      state.loading = false;
      return state;
    },
    updateWalkthrough: (state) => {
      return {
        ...state,
        user: {
          ...state.user,
          is_walkthrough: true,
        },
      };
    },
    
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      return state;
    },
    setWSTicket: (state, action:PayloadAction<string>) => {
      state.wsTicket = action.payload;
    }
  },
  extraReducers: (builder) => {
    //GET USER EXAMPLE
    builder.addCase(fetctUser.pending, handlers.user.pending);
    builder.addCase(fetctUser.fulfilled, handlers.user.success);
    builder.addCase(fetctUser.rejected, handlers.user.rejected);
  },
});

export const { setUser, setUserLoading, setWSTicket, updateWalkthrough } = userSlice.actions;

export default userSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserBio {
  full_name: string;
}

export interface KycProp {
  id: number
}

export interface UserBioProp {
  userBio: UserBio;
  kyc: KycProp | number | null;
}

const initialState: UserBioProp = {
  userBio: {
    full_name: "",
  },
  kyc: null
};

export const userBioSlice = createSlice({
  name: "userBio",
  initialState,
  reducers: {
    setUserBio: (state, action: PayloadAction<UserBio>) => {
      state.userBio = action.payload;
    },
    setUserKYC: (state, action: PayloadAction<KycProp>) => {
      state.kyc = action.payload.id;
    },
  },
});

export const { setUserBio, setUserKYC } = userBioSlice.actions;

export default userBioSlice.reducer;

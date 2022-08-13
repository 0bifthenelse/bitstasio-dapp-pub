import { createSlice } from '@reduxjs/toolkit';

export const slice_referral: any = createSlice({
  name: 'slice_referral',
  initialState: {
    level: 0,
    referredBy: "",
    bitsReceived: "",
    tokensReceived: "",
    uses: 0
  },
  reducers: {
    set_level: (state, action) => {
      state.level = action.payload;
    },
    set_referredBy: (state, action) => {
      state.referredBy = action.payload;
    },
    set_bitsReceived: (state, action) => {
      state.bitsReceived = action.payload;
    },
    set_tokensReceived: (state, action) => {
      state.tokensReceived = action.payload;
    },
    set_uses: (state, action) => {
      state.uses = action.payload;
    },
  }
});

export const {
  set_level,
  set_referredBy,
  set_bitsReceived,
  set_tokensReceived,
  set_uses
} = slice_referral.actions;
export type RootState = ReturnType<typeof slice_referral.reducer>;
export default slice_referral.reducer;
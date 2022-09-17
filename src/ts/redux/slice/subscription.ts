import { createSlice } from '@reduxjs/toolkit';

export const slice_subscription: any = createSlice({
  name: 'slice_subscription',
  initialState: {
    farms: [false, ""],
    balance: false,
    transfer: false,
    jackpot: false
  },
  reducers: {
    set_subscribe_farms: (state, action) => {
      state.farms = action.payload;
    },
    set_subscribe_balance: (state, action) => {
      state.balance = action.payload;
    },
    set_subscribe_transfer: (state, action) => {
      state.transfer = action.payload;
    },
    set_subscribe_jackpot: (state, action) => {
      state.jackpot = action.payload;
    },
  }
});

export const {
  set_subscribe_farms,
  set_subscribe_balance,
  set_subscribe_transfer,
  set_subscribe_jackpot,
} = slice_subscription.actions;
export type SubscriptionState = ReturnType<typeof slice_subscription.reducer>;
export default slice_subscription.reducer;
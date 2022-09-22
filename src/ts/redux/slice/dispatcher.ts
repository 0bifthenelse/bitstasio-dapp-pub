import { createSlice } from '@reduxjs/toolkit';

export const slice_dispatcher: any = createSlice({
  name: 'slice_dispatcher',
  initialState: {
    authorized: false,
    balance: 0
  },
  reducers: {
    set_authorized: (state, action) => {
      const authorized = action.payload;

      if (state.authorized != authorized) state.authorized = authorized;
    },
    set_balance: (state, action) => {
      const balance = action.payload;

      if (state.balance != balance) state.balance = balance;
    },
  }
});

export const {
  set_authorized,
  set_balance
} = slice_dispatcher.actions;
export type RootState = ReturnType<typeof slice_dispatcher.reducer>;
export default slice_dispatcher.reducer;
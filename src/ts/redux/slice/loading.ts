import { createSlice } from '@reduxjs/toolkit';

export const slice_loading: any = createSlice({
  name: 'slice_loading',
  initialState: {
    deposit: false,
    compound: false,
    claim: false,
    approve: false
  },
  reducers: {
    set_deposit: (state, action) => {
      state.deposit = action.payload;
    },
    set_compound: (state, action) => {
      state.compound = action.payload;
    },
    set_claim: (state, action) => {
      state.claim = action.payload;
    },
    set_approve: (state, action) => {
      state.approve = action.payload;
    }
  },
});

export const {
  set_deposit,
  set_compound,
  set_claim,
  set_approve
} = slice_loading.actions;
export type RootState = ReturnType<typeof slice_loading.reducer>;
export default slice_loading.reducer;
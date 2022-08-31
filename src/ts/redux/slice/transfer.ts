import { createSlice } from '@reduxjs/toolkit';
import Web3 from 'web3';

export const slice_transfer = createSlice({
  name: 'slice_transfer',
  initialState: {
    funds: 0
  },
  reducers: {
  },
});

export const {
} = slice_transfer.actions;
export type RootState = ReturnType<typeof slice_transfer.reducer>;
export default slice_transfer.reducer;
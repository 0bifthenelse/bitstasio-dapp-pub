import { createSlice } from '@reduxjs/toolkit';
import Web3 from 'web3';
import {
  RPC
} from '../../constants'

export const slice_web3 = createSlice({
  name: 'slice_web3',
  initialState: {
    provider: new Web3(Web3.givenProvider || RPC),
    wallet: '',
    network: null,
    funds: 0,
    block: 0
  },
  reducers: {
    reset_web3: (state) => {
      const init = slice_web3.getInitialState();

      state.funds = init.funds;
    },
    update_provider: (state, action) => {
      state.provider = new Web3(action.payload);
    },
    update_wallet: (state, action) => {
      state.wallet = action.payload;
    },
    update_network: (state, action) => {
      state.network = action.payload;
    },
    update_funds: (state, action) => {
      state.funds = action.payload;
    },
  update_block: (state, action) => {
      state.block = action.payload;
    },
  },
});

export const {
  reset_web3,
  update_provider,
  update_wallet,
  update_network,
  update_funds,
  update_block
} = slice_web3.actions;
export type RootState = ReturnType<typeof slice_web3.reducer>;
export default slice_web3.reducer;
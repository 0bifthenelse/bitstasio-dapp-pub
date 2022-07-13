import { createSlice } from '@reduxjs/toolkit';

export const slice_mining: any = createSlice({
  name: 'slice_mining',
  initialState: {
    ref: "",
    ready: false,
    loading_hire: false,
    loading_compound: false,
    loading_pocket: false,
    funds_to_hire: "",
    miners: 0,
    miners_to_receive: 0,
    contract_balance: 0,
    inBarrel: 0,
    fullBarrel: 0,
    tvl: 0,
    lastSecondsUntilFull: ''
  },
  reducers: {
    reset_mining: (state) => {
      const init = slice_mining.getInitialState();

      state.ready = init.ready;
      state.tvl = init.tvl;
      state.loading_hire = init.loading_hire;
      state.loading_compound = init.loading_compound;
      state.loading_pocket = init.loading_pocket;
      state.miners = init.miners;
      state.miners_to_receive = init.miners_to_receive;
      state.inBarrel = init.inBarrel;
      state.fullBarrel = init.fullBarrel;
      state.lastSecondsUntilFull = init.lastSecondsUntilFull;
    },
    update_ref: (state, action) => {
      if (state.ref == "") state.ref = action.payload;
    },
    update_ready: (state, action) => {
      state.ready = action.payload;
    },
    update_loading_hire: (state, action) => {
      state.loading_hire = action.payload;
    },
    update_loading_compound: (state, action) => {
      state.loading_compound = action.payload;
    },
    update_loading_pocket: (state, action) => {
      state.loading_pocket = action.payload;
    },
    update_funds_to_hire: (state, action) => {
      if (!state.loading_hire && state.ready) {
        if (action.payload >= 0) {
          state.funds_to_hire = action.payload;
        } else {
          state.funds_to_hire = "";
        }
      }
    },
    update_miners: (state, action) => {
      state.miners = action.payload;
    },
    update_miners_to_receive: (state, action) => {
      state.miners_to_receive = action.payload;
    },
    update_contract_balance: (state, action) => {
      state.contract_balance = action.payload;
    },
    update_inBarrel: (state, action) => {
      state.inBarrel = action.payload;
    },
    update_fullBarrel: (state, action) => {
      state.fullBarrel = action.payload;
    },
    update_tvl: (state, action) => {
      state.tvl = action.payload;
    },
    update_lastSecondsUntilFull: (state, action) => {
      state.lastSecondsUntilFull = action.payload;
    }
  },
});

export const {
  reset_mining,
  update_ref,
  update_ready,
  update_loading_hire,
  update_loading_compound,
  update_loading_pocket,
  update_funds_to_hire,
  update_miners,
  update_miners_to_receive,
  update_contract_balance,
  update_inBarrel,
  update_fullBarrel,
  update_tvl,
  update_lastSecondsUntilFull
} = slice_mining.actions;
export type RootState = ReturnType<typeof slice_mining.reducer>;
export default slice_mining.reducer;
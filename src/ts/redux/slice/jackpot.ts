import { createSlice } from '@reduxjs/toolkit';

const initial_state = {
  constant: {
    audit: "",
    address: "",
    chain_id: null
  },
  admin: false,
  balance: 0,
  active: false,
  round: 0,
  last_deposit: "0x0000000000000000000000000000000000000000",
  remaining_block: 0,
  blocks_to_win: 0,
  victory: false,
  min: 0,
  max: 0,
  history: []
};

export const slice_jackpot = createSlice({
  name: 'slice_jackpot',
  initialState: initial_state,
  reducers: {
    reset: (state) => {
      state.constant = initial_state.constant;
      state.admin = initial_state.admin;
      state.balance = initial_state.balance;
      state.round = initial_state.round;
      state.last_deposit = initial_state.last_deposit;
      state.remaining_block = initial_state.remaining_block;
      state.blocks_to_win = initial_state.blocks_to_win;
      state.victory = initial_state.victory;
      state.min = initial_state.min;
      state.max = initial_state.max;
      state.history = initial_state.history;
    },
    set_constant: (state, action) => {
      state.constant = {
        audit: action.payload.audit,
        address: action.payload.address,
        chain_id: action.payload.chain_id
      };
    },
    set_admin: (state, action) => {
      state.admin = action.payload;
    },
    set_balance: (state, action) => {
      state.balance = action.payload;
    },
    set_active: (state, action) => {
      state.active = action.payload;
    },
    set_round: (state, action) => {
      state.round = action.payload;
    },
    set_last_deposit: (state, action) => {
      state.last_deposit = action.payload;
    },
    set_remaining_block: (state, action) => {
      state.remaining_block = action.payload;
    },
    set_blocks_to_win: (state, action) => {
      state.blocks_to_win = action.payload;
    },
    set_victory: (state, action) => {
      state.victory = action.payload;
    },
    set_min: (state, action) => {
      state.min = action.payload;
    },
    set_max: (state, action) => {
      state.max = action.payload;
    },
    set_history: (state, action) => {
      if (action.payload.length > state.history.length) {
        state.history = action.payload;
      }
    },
  },
});

export const {
  reset,
  set_constant,
  set_admin,
  set_balance,
  set_active,
  set_round,
  set_last_deposit,
  set_remaining_block,
  set_blocks_to_win,
  set_victory,
  set_history,
  set_min,
  set_max
} = slice_jackpot.actions;
export type RootState = ReturnType<typeof slice_jackpot.reducer>;
export default slice_jackpot.reducer;
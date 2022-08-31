import { createSlice } from '@reduxjs/toolkit';

export const slice_loading: any = createSlice({
  name: 'slice_loading',
  initialState: {
    farm: false,
    deposit: false,
    compound: false,
    claim: false,
    approve: false,
    jackpot: {
      start: false,
      deposit: false,
      claim: false
    }
  },
  reducers: {
    set_farm: (state, action) => {
      state.farm = action.payload;
    },
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
    },
    set_jackpot: (state, action) => {
      const type = action.payload.type;

      switch (type) {
        case "start": {
          state.jackpot.start = action.payload.value;

          break;
        }
        case "deposit": {
          state.jackpot.deposit = action.payload.value;

          break;
        }
        case "claim": {
          state.jackpot.claim = action.payload.value;

          break;
        }
      }
    }
  },
});

export const {
  set_farm,
  set_deposit,
  set_compound,
  set_claim,
  set_approve,
  set_jackpot
} = slice_loading.actions;
export type RootState = ReturnType<typeof slice_loading.reducer>;
export default slice_loading.reducer;
import { createSlice } from '@reduxjs/toolkit';

export const slice_calculator: any = createSlice({
  name: 'slice_calculator',
  initialState: {
    investment: 0,
    apr: 0,
    days: 0
  },
  reducers: {
    set_investment: (state, action) => {
      const input = action.payload;

      if (input >= 0) state.investment = action.payload;
      else state.investment = 0;
    },
    set_apr: (state, action) => {
      const input = action.payload;

      if (input >= 0) state.apr = action.payload;
      else state.apr = 0;
    },
    set_days: (state, action) => {
      const input = action.payload;

      if (input >= 0) state.days = action.payload;
      else state.days = 0;
    }
  }
});

export const {
  set_investment,
  set_apr,
  set_days,
} = slice_calculator.actions;
export type RootState = ReturnType<typeof slice_calculator.reducer>;
export default slice_calculator.reducer;
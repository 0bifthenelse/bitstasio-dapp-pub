import { createSlice } from '@reduxjs/toolkit';

export const slice_page: any = createSlice({
  name: 'slice_page',
  initialState: {
    actual: "main"
  },
  reducers: {
    set_actual: (state, action) => {
      state.actual = action.payload;
    }
  }
});

export const {
  set_actual
} = slice_page.actions;
export type RootState = ReturnType<typeof slice_page.reducer>;
export default slice_page.reducer;
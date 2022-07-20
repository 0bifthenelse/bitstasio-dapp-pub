import { createSlice } from '@reduxjs/toolkit';

export const slice_activity: any = createSlice({
  name: 'slice_activity',
  initialState: {
    loading: false,
    queue: [] as Array<Activity>
  },
  reducers: {
    update_active: (state, action) => {
      const index = action.payload;
      const activity = state.queue[index];

      if (activity) {
        const newArray = [...state.queue];

        newArray[index].active = false;
        state.queue = newArray;
      }
    },
    set_loading: (state) => {
      state.loading = true;
    },
    update_left: (state, action) => {
      const index = action.payload;
      const activity = state.queue[index];

      if (activity) {
        const left = activity.left -= 60;
        const newArray = [...state.queue];
        newArray[index].left = left;

        state.queue = newArray;
      }
    },
    add_queue: (state, action) => {
      state.queue = state.queue.concat(action.payload);

      state.loading = false;
    },
    remove_queue: (state) => {
      state.queue = state.queue.slice(1);
    }
  },
});

export const {
  update_active,
  update_left,
  set_loading,
  add_queue,
  remove_queue,
} = slice_activity.actions;
export type RootState = ReturnType<typeof slice_activity.reducer>;
export default slice_activity.reducer;
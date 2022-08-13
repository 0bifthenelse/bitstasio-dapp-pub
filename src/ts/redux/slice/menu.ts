import { createSlice } from '@reduxjs/toolkit';

import {
  menu_dimensions
} from '../../constants';
import store from '../store';

export const slice_menu = createSlice({
  name: 'slice_menu',
  initialState: {
    box_active: "wallet",
    box_visible: false,
    box_position: {} as Menu,
    arrow_position: {} as Menu,
    box_dimensions: {},
    box_hover: false,
    container_hover: false,
    wallet: {} as Menu,
    products: {} as Menu,
    socials: {} as Menu,
  },
  reducers: {
    update_box_active: (state, action: any) => {
      const menu = action.payload;
      const index = menu_dimensions.findIndex(e => e.menu == menu);
      const dimensions = menu_dimensions[index].dimensions;

      state.box_dimensions = dimensions;

      switch (action.payload) {
        case "wallet": { state.box_position = state.wallet; break; }
        case "products": { state.box_position = state.products; break; }
        case "socials": { state.box_position = state.socials; break; }
      }

      state.box_active = menu;
      state.box_visible = true;
    },
    update_box_visible: (state, action: any) => {
      state.box_visible = action.payload;
    },
    update_position: (state, action: any) => {
      switch (action.payload.menu) {
        case "wallet": {
          if (state.wallet.top != action.payload.position.top) state.wallet.top = action.payload.position.top;
          if (state.wallet.left != action.payload.position.left) state.wallet.left = action.payload.position.left;

          break;
        }
        case "products": {
          if (state.products.top != action.payload.position.top) state.products.top = action.payload.position.top;
          if (state.products.left != action.payload.position.left) state.products.left = action.payload.position.left;

          break;
        }
        case "socials": {
          if (state.socials.top != action.payload.position.top) state.socials.top = action.payload.position.top;
          if (state.socials.left != action.payload.position.left) state.socials.left = action.payload.position.left;

          break;
        }
      }

      if (!state.box_position.left) state.box_position = state.wallet;
    },
    update_box_hover: (state, action: any) => {
      state.box_hover = action.payload;

      if (!state.container_hover && !state.box_hover) state.box_visible = false;
    },
    update_container_hover: (state, action: any) => {
      state.container_hover = action.payload;

      if (!state.container_hover && !state.box_hover) {
        state.box_visible = false;
      }
    },
    reset_box_active: (state) => {
      state.box_visible = false;
    }
  },
});

export const {
  update_box_active,
  update_box_visible,
  update_position,
  update_box_hover,
  update_container_hover,
  reset_box_active
} = slice_menu.actions;
export type RootState = ReturnType<typeof slice_menu.reducer>;
export default slice_menu.reducer;
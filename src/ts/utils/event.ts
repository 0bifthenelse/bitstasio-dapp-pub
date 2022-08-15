import store from "store";
import {
  update_block
} from 'slice/web3';
import {
  toggle_opened,
  set_selected
} from 'slice/currency';
import {
  set_farm
} from 'slice/loading';

export function new_block(block: number): boolean {
  const last_block = store.getState().web3.block;

  if (last_block != block) {
    store.dispatch(update_block(block));
    store.dispatch(set_farm(false));

    return true;
  }

  return false;

}

export function farm_currency_select(id: number) {
  store.dispatch(toggle_opened());
  store.dispatch(set_selected(id));
  store.dispatch(set_farm(true));
}
import store from "store";
import {
  update_block
} from 'slice/web3';
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
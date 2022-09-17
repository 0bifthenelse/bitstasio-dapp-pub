import connection from "../rpc";
import store from 'store';
import { fromWei } from 'web3-utils';

import * as data from 'utils/data';
import * as factory from 'slice/jackpot';
import Jackpot from 'utils/arbitrator/jackpot';

export default async function init(): Promise<void> {
  const jackpot = data.get_jackpot();

  if (jackpot) {
    const contract = jackpot.contract;

    if (contract != "") await Promise.all([balance(contract), active(contract), range(contract), victory(contract), round(contract), last_deposit(contract), remaining_block(contract), admin(contract), blocks_to_win(contract), history(contract)]);
    else store.dispatch(factory.reset());
  }
}

async function balance(address: string): Promise<void> {
  store.dispatch(factory.set_balance(await Jackpot.get_balance(address)));
}

async function active(address: string): Promise<void> {
  store.dispatch(factory.set_active(await Jackpot.get_active(address)));
}

async function round(address: string): Promise<void> {
  store.dispatch(factory.set_round(await Jackpot.get_round(address)));
}

async function last_deposit(address: string): Promise<void> {
  store.dispatch(factory.set_last_deposit(await Jackpot.get_last_deposit(address)));
}

async function remaining_block(address: string): Promise<void> {
  store.dispatch(factory.set_remaining_block(await Jackpot.get_remaining_blocks(address)));
}

async function blocks_to_win(address: string): Promise<void> {
  if (store.getState().jackpot.blocks_to_win == 0) store.dispatch(factory.set_blocks_to_win(await Jackpot.get_blocks_to_win(address)));
}

async function victory(address: string): Promise<void> {
  const state = store.getState();
  const victory = await Jackpot.get_victory(address);
  const wallet = state.web3.wallet;
  const last_depositor = state.jackpot.last_deposit;

  if (victory && last_depositor == wallet) store.dispatch(factory.set_victory(true));
  else store.dispatch(factory.set_victory(false));
}

async function range(address: string): Promise<void> {
  if (store.getState().jackpot.min == 0) {
    const [min, max]: [number, number] = await Jackpot.get_min_max(address);

    store.dispatch(factory.set_min(min));
    store.dispatch(factory.set_max(max));
  }
}

async function admin(address: string): Promise<void> {
  store.dispatch(factory.set_admin(store.getState().web3.wallet == await Jackpot.get_admin(address)));
}

async function history(address: string): Promise<void> {
  store.dispatch(factory.set_history(await Jackpot.get_history(address)));
}
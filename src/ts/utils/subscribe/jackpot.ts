import connection from "../rpc";
import store from 'store';
import { AbiItem, fromWei } from 'web3-utils';

import {
  jackpot_abi
} from 'constant';

import {
  get_jackpot_address
} from 'utils/data';

import {
  reset,
  set_admin,
  set_active,
  set_balance,
  set_round,
  set_last_deposit,
  set_remaining_block,
  set_blocks_to_win,
  set_victory,
  set_history,
  set_min,
  set_max
} from 'slice/jackpot';

export default async function init(): Promise<void> {
  const address = get_jackpot_address();

  if (address != "") await Promise.all([balance(address), active(address), range(address), victory(address), round(address), last_deposit(address), remaining_block(address), admin(address), blocks_to_win(address), history(address)]);
  else store.dispatch(reset());
}

async function balance(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract_balance = await rpc.eth.getBalance(address);

    store.dispatch(set_balance(fromWei(contract_balance, "ether")));
  });
}

async function active(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
    const is_active = await contract.methods.active().call();

    store.dispatch(set_active(is_active));
  });
}

async function round(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
    const current_round = await contract.methods.round().call();

    store.dispatch(set_round(current_round));
  });
}

async function last_deposit(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
    const depositor = await contract.methods.lastDepositWallet().call();

    store.dispatch(set_last_deposit(depositor));
  });
}

async function remaining_block(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
    const blocks = await contract.methods.getRemainingBlocks().call();

    store.dispatch(set_remaining_block(blocks));
  });
}

async function blocks_to_win(address: string): Promise<void> {
  if (store.getState().jackpot.blocks_to_win == 0) {
    connection(async (rpc: TRPC) => {
      const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
      const blocks = await contract.methods.BLOCKS_TO_WIN().call();

      store.dispatch(set_blocks_to_win(blocks));
    });
  }
}

async function victory(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
    const victory = await contract.methods.getIsVictory().call();
    const last_depositor = await contract.methods.lastDepositWallet().call();

    if (victory && last_depositor == store.getState().web3.wallet) store.dispatch(set_victory(true));
    else store.dispatch(set_victory(false));
  });
}

async function range(address: string): Promise<void> {
  if (store.getState().jackpot.min == 0) {
    connection(async (rpc: TRPC) => {
      const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
      const min = parseFloat(fromWei(await contract.methods.MIN_DEPOSIT().call(), "ether"));
      const max = parseFloat(fromWei(await contract.methods.MAX_DEPOSIT().call(), "ether"));

      store.dispatch(set_min(min));
      store.dispatch(set_max(max));
    });
  }
}

async function admin(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
    const admin = await contract.methods.admin().call();

    store.dispatch(set_admin(store.getState().web3.wallet == admin));
  });
}

async function history(address: string): Promise<void> {
  connection(async (rpc: TRPC) => {
    const contract = new rpc.eth.Contract(jackpot_abi as AbiItem[], address);
    const winners_raw = await contract.methods.getWinnerHistory().call();
    const winners: Array<JackpotHistory> = [];

    for (const winner of winners_raw) {
      winners.push({
        wallet: winner.wallet,
        block_number: winner.blockNumber,
        prize: winner.prize
      })
    }

    store.dispatch(set_history(winners));
  });
}
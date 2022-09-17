import * as constants from 'constant';
import abi from 'human-standard-token-abi';

import connection from "../rpc";
import store from 'store';
import { AbiItem } from 'web3-utils';

import {
  balances
} from 'utils/data';

import {
  set_balance
} from 'slice/factory';

export default async function init() {
  await init_data();
}

async function init_data(): Promise<void> {
  balances((balance: BalanceJSON) => {
    connection((rpc: TRPC) => {
      if (balance.coin) return init_data_coin(rpc, balance);
      else return init_data_token(rpc, balance);
    });
  });
}

async function init_data_coin(rpc: TRPC, balance: BalanceJSON) {
  try {
    const state = store.getState();
    const chain_id = balance.chain_id;

    if (chain_id == state.web3.network) {
      const name = balance.name;
      const coin = balance.coin;
      const amount = await rpc.eth.getBalance(state.web3.wallet);

      const balance_data = {
        name: name,
        chain_id: chain_id,
        amount: amount,
        coin: coin
      };


      store.dispatch(set_balance(balance_data));
    }
  } catch (error: any) {
  }
}

async function init_data_token(rpc: TRPC, balance: BalanceJSON) {
  try {
    const state = store.getState();
    const chain_id = balance.chain_id;

    if (chain_id == state.web3.network) {
      const name = balance.name;
      const coin = balance.coin;
      const address = balance.address;
      const contract = new rpc.eth.Contract(abi as AbiItem[], address);
      const amount = await contract.methods.balanceOf(state.web3.wallet).call();

      const balance_data = {
        name: name,
        chain_id: chain_id,
        amount: amount,
        address: address,
        coin: coin
      };

      store.dispatch(set_balance(balance_data));
    }
  } catch (error: any) { }
}
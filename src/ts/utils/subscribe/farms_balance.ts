import {
  token_abi,
  coin_abi
} from 'constant';

import connection from "../rpc";
import store from 'store';
import { AbiItem } from 'web3-utils';

import {
  currencies
} from 'utils/data';

import {
  set_contract_balance
} from 'slice/currency';

export default async function init() {
  await init_data();
}

async function init_data(): Promise<void> {
  currencies(async (currency: FarmJSON) => {
    if (currency.coin) await init_data_coin(currency);
    else await init_data_token(currency);
  });
}

async function init_data_coin(currency: FarmJSON) {
  connection(async (rpc: TRPC) => {
    try {
      const contract = new rpc.eth.Contract(coin_abi as AbiItem[], currency.contract);
      const contract_balance = rpc.utils.fromWei(await contract.methods.getBalance().call(), "ether");
      const data = {
        id: currency.id,
        contract_balance: contract_balance
      };

      store.dispatch(set_contract_balance(data));
    } catch (error: any) { }
  });
}

async function init_data_token(currency: FarmJSON) {
  connection(async (rpc: TRPC) => {
    try {
      const contract = new rpc.eth.Contract(token_abi as AbiItem[], currency.contract);
      const contract_balance = rpc.utils.fromWei(await contract.methods.getBalance().call(), "ether");
      const data = {
        id: currency.id,
        contract_balance: contract_balance
      };

      store.dispatch(set_contract_balance(data));
    } catch (error: any) { }
  });
}
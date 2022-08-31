import {
  coin_abi,
  token_abi
} from 'constant';

import connection from "../rpc";
import store from 'store';
import { AbiItem } from 'web3-utils';

import {
  update_wallet,
  update_network,
  update_block
} from 'slice/web3';

import {
  currencies,
  selected_currency
} from 'utils/data';

export default async function subscribe_transfer() {
  console.log("updated transfers");
}
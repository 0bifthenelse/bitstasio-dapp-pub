import { net } from '../constants';
import store from '../redux/store';

import {
  RPC,
  RPC_TESTNET
} from '../constants';

export default (action: Function, mainnet: boolean) => {
  const state = store.getState();
  const network = state.web3.network;

  const is_mainnet = network == net.mainnet;
  const is_testnet = network == net.testnet;

  if (is_mainnet && mainnet) return action(RPC);
  else if (is_testnet && !mainnet) return action(RPC_TESTNET);

  return null;
}
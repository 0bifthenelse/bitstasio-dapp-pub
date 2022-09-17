import store from 'store';

import {
  update_network,
  update_wallet
} from 'slice/web3';

import * as factory from 'slice/factory';

import {
  get_default_chain_id,
  is_network_supported
} from 'utils/rpc';

export default async function init(): Promise<void> {
  await Promise.all([network(), wallet()]);
}

async function change() {
  store.dispatch(factory.reset());
}

async function network() {
  try {
    const state = store.getState();
    const provider = state.web3.provider;
    let network = provider.currentProvider ? await state.web3.provider.eth.net.getId() : get_default_chain_id();
    const is_supported = is_network_supported(network);

    if (!is_supported) network = get_default_chain_id();

    if (network != state.web3.network) {
      store.dispatch(update_network(network));

      change();
    }

  } catch (error: any) {
    console.error(error);
  }
}

async function wallet(): Promise<void> {
  try {
    const state = store.getState();
    const provider = state.web3.provider;
    const wallet = provider.currentProvider ? (await state.web3.provider.eth.getAccounts())[0] : undefined;

    store.dispatch(update_wallet(wallet));
  } catch (error: any) {
    console.error(error);
  }
}
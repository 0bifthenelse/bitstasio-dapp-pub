import store from 'store';

import {
  update_network,
  update_wallet
} from 'slice/web3';

import {
  reset
} from 'slice/currency';

import {
  get_default_chain_id
} from 'utils/rpc';

export default async function init(): Promise<void> {
  await Promise.all([network(), wallet()]);
}

async function change() {
  store.dispatch(reset());
}

async function network() {
  try {
    const state = store.getState();
    const provider = state.web3.provider;
    const network = provider.currentProvider ? await state.web3.provider.eth.net.getId() : get_default_chain_id();

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
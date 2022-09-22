import store from 'store';

import DispatcherArbitrator from 'utils/arbitrator/dispatcher';

import * as dispatcher from 'slice/dispatcher';

export default async function init(): Promise<void> {
  await Promise.all([
    external()
  ]);
}

async function external(): Promise<void> {
  const balance = await DispatcherArbitrator.get_balance();
  const authorized = DispatcherArbitrator.get_authorized();

  store.dispatch(dispatcher.set_balance(balance));
  store.dispatch(dispatcher.set_authorized(authorized));
}
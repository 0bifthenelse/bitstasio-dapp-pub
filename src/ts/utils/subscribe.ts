import store from 'store';

import {
  update_block
} from 'slice/web3';

import {
  new_block
} from './event';

import {
  SubscriptionState
} from 'slice/subscription';

import connection from 'utils/rpc';

import subscribe_transfer from './subscribe/transfer';
import subscribe_balance from './subscribe/balance';
import subscribe_farms_balance from './subscribe/farms_balance';
import subscribe_jackpot from './subscribe/jackpot';
import subscribe_farms from './subscribe/farms';
import subscribe_time from './subscribe/time';
import subscribe_network from './subscribe/network';

export default async function subscribe(): Promise<void> {
  await trigger_network();

  connection(async (rpc: TRPC) => {
    const blockNumber = await rpc.eth.getBlockNumber();

    store.dispatch(update_block(blockNumber));

    trigger(true);

    setInterval(async () => {
      const blockNumber = await rpc.eth.getBlockNumber();

      if (new_block(blockNumber)) await trigger(false);
    }, 1000);
  });
}

async function trigger(once: boolean) {
  const subscriptions: SubscriptionState = store.getState().subscription;

  trigger_time(once);
  trigger_network();
  trigger_balance();

  if (subscriptions.farms) await trigger_farms();
  else if (subscriptions.transfer) await trigger_transfer();
  else if (subscriptions.jackpot) await trigger_jackpot();
}

async function trigger_time(once: boolean): Promise<void> {
  await subscribe_time(once);
}

async function trigger_balance(): Promise<void> {
  await subscribe_balance();
}

async function trigger_network(): Promise<void> {
  await subscribe_network();
}

async function trigger_farms(): Promise<void> {
  await subscribe_farms();
  await subscribe_farms_balance();
}

async function trigger_transfer(): Promise<void> {
  await subscribe_transfer();
}

async function trigger_jackpot(): Promise<void> {
  await subscribe_jackpot();
}
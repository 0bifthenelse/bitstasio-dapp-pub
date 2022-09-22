import store from 'store';

import {
  update_block
} from 'slice/web3';

import {
  new_block
} from './event';

import connection, { is_network_supported } from 'utils/rpc';

import subscribe_transfer from './subscribe/transfer';
import subscribe_balance from './subscribe/balance';
import subscribe_jackpot from './subscribe/jackpot';
import subscribe_farms from './subscribe/farms';
import subscribe_time from './subscribe/time';
import subscribe_network from './subscribe/network';
import subscribe_dispatcher from './subscribe/dispatcher';

export default async function subscribe(): Promise<void> {
  subscribe_network();
  subscribe_time();

  connection(async (rpc: TRPC) => {
    const blockNumber = await rpc.eth.getBlockNumber();

    store.dispatch(update_block(blockNumber));

    heartbeat();

    setInterval(async () => {
      const network = (store.getState() as unknown as any)?.web3.network;
      const is_supported = is_network_supported(network);

      if (is_supported) {
        const blockNumber = await rpc.eth.getBlockNumber();

        if (new_block(blockNumber)) await heartbeat();
      }
    }, 1000);
  });
}

async function heartbeat(): Promise<void> {
  subscribe_network();
  subscribe_balance();

  await Promise.all([
    subscribe_farms(),
    subscribe_transfer(),
    subscribe_jackpot(),
    subscribe_dispatcher()
  ]);
}
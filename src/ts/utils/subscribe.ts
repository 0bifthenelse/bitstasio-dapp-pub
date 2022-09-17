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

export default async function subscribe(): Promise<void> {
  heartbeat_network();
  heartbeat_time();

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
  heartbeat_network();
  heartbeat_balance();

  await Promise.all([
    heartbeat_farms(),
    heartbeat_transfer(),
    heartbeat_jackpot()
  ]);
}

async function heartbeat_time(): Promise<void> {
  await subscribe_time();
}

async function heartbeat_balance(): Promise<void> {
  await subscribe_balance();
}

async function heartbeat_network(): Promise<void> {
  await subscribe_network();
}

async function heartbeat_farms(): Promise<void> {
  await subscribe_farms();
}

async function heartbeat_transfer(): Promise<void> {
  await subscribe_transfer();
}

async function heartbeat_jackpot(): Promise<void> {
  await subscribe_jackpot();
}
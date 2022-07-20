import {
  launched,
  mining_abi,
  mining_contract,
  RPC,
  RPC_SUB,
  net
} from '../constants';

import {
  reset_web3,
  update_wallet,
  update_funds,
  update_network
} from '../redux/slice/web3';

import {
  reset_mining,
  update_ref,
  update_miners,
  update_ready,
  update_contract_balance,
  update_inBarrel,
  update_fullBarrel,
  update_tvl,
  update_lastSecondsUntilFull,
  RootState
} from '../redux/slice/mining';

import {
  update_left,
  remove_queue
} from '../redux/slice/activity';

import {
  compound,
  hire,
  withdraw
} from './activity';

import store from '../redux/store';
import { AbiItem } from 'web3-utils';
import BN from 'bn.js';

export default async function subscribe(): Promise<void> {
  /*
  setTimeout(() => compound("0xzada", "0xazdlambo"), 1000);
  setTimeout(() => hire("0xzado0Qa", "0xazdlambo", "0.12"), 1000);
  setTimeout(() => withdraw("0xzada0x", "0xazdlambo", "0.13412"), 1000);
  setTimeout(() => hire("0xzada01axxxzS", "0xazdlambo", "0.1291"), 1000);
  setTimeout(() => compound("0xzaxxda", "0xazdlambo"), 1000);

  setTimeout(() => hire("0xzada01S", "0xazdlambo", "0.1291"), 20100);
  setTimeout(() => hire("0xz00ada01S", "0xazdlambo", "0.1291"), 20100);
  setTimeout(() => hire("0xza909dxxxa01S", "0xazdlambo", "0.1291"), 20100);
  setTimeout(() => hire("0xzada1101S", "0xazdlambo", "0.1291"), 20100);
  */
  subscribe_activity();
  const newBlock = RPC_SUB.eth.subscribe("newBlockHeaders");

  subscribe_ref();
  subscribe_wallet();
  subscribe_network();
  subscribe_funds();

  newBlock.on("data", async (event: any) => {
    const blockNumber = event.number;

    subscribe_wallet();
    subscribe_network();
    subscribe_funds();
    subscribe_contract_balance();
    subscribe_ref();
    subscribe_mining();

    subscribe_miner(blockNumber);
  });
}

async function subscribe_activity(): Promise<void> {
  setInterval(async () => {
    const state = store.getState();
    // @ts-ignore
    const list = state.activity.queue;

    list.forEach((activity: Activity, index: number) => {
      if (activity) store.dispatch(update_left(index));
    });
  }, 1000);
}

async function subscribe_miner(blockNumber: number): Promise<void> {
  const block = await RPC_SUB.eth.getBlock(blockNumber, true);
  const address = mining_contract;

  for (const transaction of block.transactions) {
    try {
      const hash = transaction?.hash;
      const input = transaction?.input;
      const from = transaction?.from;
      const to = transaction?.to;
      const is_valid = to && from && to == address;

      if (is_valid) {
        const is_hire = input.startsWith("0xdb663865");
        const is_withdraw = input.startsWith("0x3955f0fe");
        const is_compound = input.startsWith("0x3ec862a8");

        if (is_hire) hire(transaction.hash, from, transaction.value);
        else if (is_withdraw) withdraw(hash, from, transaction.value);
        else if (is_compound) compound(hash, from);
      }
    } catch (error: any) {

    }
  }
}

async function subscribe_wallet(): Promise<void> {
  try {
    const state = store.getState();
    const wallet = state.web3.provider ? (await state.web3.provider.eth.getAccounts())[0] : undefined;

    store.dispatch(update_wallet(wallet));
  } catch (error: any) {
    console.error(error);
  }
}

async function subscribe_network(): Promise<void> {
  try {
    const state = store.getState();
    const network = state.web3.provider ? await state.web3.provider.eth.net.getId() : undefined;

    store.dispatch(update_network(network == net ? network : undefined));
  } catch (error: any) {
    console.error(error);
  }
}

async function subscribe_funds(): Promise<void> {
  const state = store.getState();
  // @ts-ignore
  const ready = state.mining.ready;

  if (state.web3.wallet && ready) {
    try {
      const gwei = new BN(await RPC.eth.getBalance(state.web3.wallet)).div(new BN(1e9.toString()));
      const funds = (gwei.toNumber() / 1e9).toFixed(4);

      store.dispatch(update_funds(funds));
    } catch (error: any) {
      console.error(error);
    }
  }
}

async function subscribe_contract_balance(): Promise<void> {
  if (launched) {
    const contract = new RPC.eth.Contract(mining_abi as AbiItem[], mining_contract);
    const contract_balance = RPC.utils.fromWei(await contract.methods.getBalance().call(), "ether");

    store.dispatch(update_contract_balance(contract_balance));
  }
}

async function subscribe_ref(): Promise<void> {
  const urlParams = new URLSearchParams(location.search);
  const ref = urlParams.get('ref');

  store.dispatch(update_ref(ref));
}

async function subscribe_mining(): Promise<void> {
  try {
    if (launched) {
      const state = store.getState();
      const web3 = state.web3.provider;
      const wallet = state.web3.wallet;
      const contract = new web3.eth.Contract(mining_abi as AbiItem[], mining_contract);
      const eggValue = await contract.methods.calculateEggSell(2592000).call();
      const eggs = parseInt(await contract.methods.getMyEggs().call({ from: wallet }));
      const miners = parseInt(await contract.methods.getMyMiners().call({ from: wallet }));
      const lastSecondsUntilFull = 43200 - (eggs / miners);

      store.dispatch(update_miners(miners));
      store.dispatch(update_lastSecondsUntilFull(lastSecondsUntilFull));

      if (wallet) {
        if (miners > 0) {
          const minerValue = 1.05 * parseFloat(state.web3.provider.utils.fromWei(eggValue, "ether"));
          const tvl = minerValue * miners;

          store.dispatch(update_tvl(tvl));
        }

        if (miners > 0 && eggs > 0) {
          const myMinersValueBig = await contract.methods.calculateEggSell(eggs).call();
          const myMinersValue = parseFloat(state.web3.provider.utils.fromWei(myMinersValueBig, "ether"));
          const devFee = parseFloat(state.web3.provider.utils.fromWei(await contract.methods.devFee(myMinersValueBig).call(), "ether"));
          const inBarrel = myMinersValue - devFee;
          const fullBarrel = (86400 * inBarrel) / Math.min(2592000 - lastSecondsUntilFull, 86400);

          store.dispatch(update_inBarrel(inBarrel));
          store.dispatch(update_fullBarrel(fullBarrel));
        }
        store.dispatch(update_ready(true));
      } else {
        store.dispatch(reset_web3());
        store.dispatch(reset_mining());
      }
    }
  } catch (error: any) {
    console.error(error);
    store.dispatch(reset_web3());
    store.dispatch(reset_mining());
    store.dispatch(update_ready(false));
  }
}
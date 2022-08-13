import {
  RPC,
  coin_abi,
  token_abi,
  net
} from '../constants';

import connection from "./rpc";

import {
  update_wallet,
  update_network,
  update_block
} from '../redux/slice/web3';

import {
  currencies,
  selected_currency
} from '../utils/data';

import {
  reset,
  set_amount,
  set_currency,
  set_tvl,
  set_shares,
  set_shares_value,
  set_withdrawable,
  set_whitelisted,
  set_allowance,
  set_selected_first,
  set_timestamp_withdraw,
  set_time_since_withdraw,
  set_contract_balance,
  set_referral
} from '../redux/slice/currency';

import {
  update_left
} from '../redux/slice/activity';


import {
  set_referredBy,
  set_uses,
  set_bitsReceived,
  set_tokensReceived,
  set_level
} from '../redux/slice/referral';

import {
  new_block
} from './event';

import store from '../redux/store';
import { AbiItem } from 'web3-utils';

export default async function subscribe(): Promise<void> {
  const blockNumber = await RPC.eth.getBlockNumber();

  store.dispatch(update_block(blockNumber));

  setInterval(subscribe_time_since_withdraw, 1000);

  subscribe_referral();
  subscribe_wallet();
  subscribe_time_since_withdraw();
  subscribe_activity();
  subscribe_network();
  subscribe_asset();

  setInterval(async () => {
    const blockNumber = await RPC.eth.getBlockNumber();

    if (new_block(blockNumber)) {
      const wallet = store.getState().web3.wallet;

      await subscribe_wallet();
      await subscribe_contract_balance();

      if (wallet) {
        await subscribe_network();
        await subscribe_asset();
        await subscribe_farm();
        //await subscribe_miner(blockNumber);
      }
    }
  }, 1000);

  store.dispatch(set_selected_first());
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

async function subscribe_time_since_withdraw(): Promise<void> {
  function time_since_date(time: number) {
    const total = new Date().getTime() - (time * 1000);
    const seconds_raw = Math.floor((total / 1000) % 60);
    const minutes_raw = Math.floor((total / 1000 / 60) % 60);
    const hours_raw = Math.floor((total / (1000 * 60 * 60)));
    const zeros = (number: number) => number > 9 ? `${number}` : `0${number}`;

    const hours = zeros(hours_raw);
    const minutes = zeros(minutes_raw);
    const seconds = zeros(seconds_raw);

    return {
      hours,
      minutes,
      seconds
    };
  }

  const state = store.getState();
  // @ts-ignore
  const currencies = state.currency.map.entries();

  for (const [_, currency] of currencies) {
    const id = currency.id;
    const timestamp_withdraw = currency.timestamp_withdraw;
    const time_since_withdraw = time_since_date(timestamp_withdraw);
    const data = {
      id: id,
      time_since_withdraw: timestamp_withdraw > 0 ? `${time_since_withdraw.hours}:${time_since_withdraw.minutes}:${time_since_withdraw.seconds}` : "---"
    };

    store.dispatch(set_time_since_withdraw(data));
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
    const is_mainnet = network == net.mainnet;
    const is_testnet = network == net.testnet;

    if (network != state.web3.network) {
      store.dispatch(update_network(is_mainnet || is_testnet ? network : undefined));
      network_reset();
    }

  } catch (error: any) {
    console.error(error);
  }
}

async function subscribe_asset(): Promise<void> {
  currencies((currency: Currency) => {
    connection((rpc: TRPC) => {
      if (currency.coin) return subscribe_asset_coin(rpc, currency);
      else return subscribe_asset_token(rpc, currency);
    }, currency.mainnet);
  });
}

async function subscribe_asset_coin(rpc: TRPC, currency: Currency) {
  try {
    const state = store.getState();
    const id = currency.id;
    const name = currency.name;
    const mainnet = currency.mainnet;
    const launch_block = currency.launch_block;
    const apr = currency.apr;
    const daily = currency.daily;
    const coin = currency.coin;
    const contract = currency.contract;
    const token_contract = currency.token_contract;

    store.dispatch(set_currency({
      id: id,
      name: name,
      mainnet: mainnet,
      apr: apr,
      daily: daily,
      coin: coin,
      contract: contract,
      launch_block: launch_block,
      token_contract: token_contract
    }));

    if (state.web3.wallet) {
      const amount = parseFloat(rpc.utils.fromWei(await rpc.eth.getBalance(state.web3.wallet), "ether"));
      const data = {
        id: id,
        amount: amount.toFixed(4)
      };

      store.dispatch(set_amount(data));
    }
  } catch (error: any) {
  }
}

async function subscribe_asset_token(rpc: TRPC, currency: Currency) {
  try {
    const state = store.getState();
    const id = currency.id;
    const name = currency.name;
    const mainnet = currency.mainnet;
    const launch_block = currency.launch_block;
    const apr = currency.apr;
    const daily = currency.daily;
    const coin = currency.coin;
    const contract = currency.contract;
    const token_contract = currency.token_contract;

    store.dispatch(set_currency({
      id: id,
      name: name,
      mainnet: mainnet,
      apr: apr,
      daily: daily,
      coin: coin,
      contract: contract,
      launch_block: launch_block,
      token_contract: token_contract
    }));

    if (state.web3.wallet) {
      const contract = new rpc.eth.Contract(token_abi as AbiItem[], currency.contract);
      const amount = rpc.utils.fromWei(await contract.methods.getBalanceToken().call({ from: state.web3.wallet }), "ether");
      const data = {
        id: id,
        amount: parseFloat(amount).toFixed(4)
      };

      store.dispatch(set_amount(data));
    }
  } catch (error: any) { }
}

async function subscribe_contract_balance(): Promise<void> {
  currencies(async (currency: CurrencyJSON) => {
    if (currency.coin) await subscribe_contract_balance_coin(currency);
    else await subscribe_contract_balance_token(currency);
  });
}

async function subscribe_contract_balance_coin(currency: CurrencyJSON) {
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
  }, currency.mainnet);
}

async function subscribe_contract_balance_token(currency: CurrencyJSON) {
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
  }, currency.mainnet);
}

async function subscribe_referral(): Promise<void> {
  const urlParams = new URLSearchParams(location.search);
  const ref = urlParams.get('ref');

  if (ref) store.dispatch(set_referral(ref));
}

async function subscribe_farm(): Promise<void> {
  selected_currency(async (currency: Currency) => {
    connection(async (rpc: TRPC) => {
      if (currency.coin) {
        await subscribe_shares_coin(rpc, currency);
        await subscribe_mining_coin(rpc, currency);
      }

      else {
        await subscribe_shares_token(rpc, currency);
        await subscribe_mining_token(rpc, currency);
        await subscribe_referral_token(rpc, currency);
      }
    }, currency.mainnet);
  });
}

async function subscribe_mining_coin(rpc: TRPC, currency: Currency) {
  const id = currency.id;
  const state = store.getState();
  const web3 = state.web3.provider;
  const wallet = state.web3.wallet;
  const contract = new web3.eth.Contract(coin_abi as AbiItem[], currency.contract);
  const eggValue = await contract.methods.calculateEggSell(2592000).call();
  const eggs = parseInt(await contract.methods.getMyEggs().call({ from: wallet }));
  const shares = parseInt(await contract.methods.getMyMiners().call({ from: wallet }));
  const timestamp_withdraw = parseInt(await contract.methods.lastHatch(wallet).call({ from: wallet }));

  store.dispatch(set_shares({ id: id, shares: shares }));
  store.dispatch(set_timestamp_withdraw({ id: id, timestamp_withdraw: timestamp_withdraw }));

  if (wallet) {
    if (shares > 0) {
      const minerValue = 1.05 * parseFloat(state.web3.provider.utils.fromWei(eggValue, "ether"));
      const tvl = minerValue * shares;

      store.dispatch(set_tvl({ id: id, tvl: tvl }));
    }

    if (shares > 0 && eggs > 0) {
      const myMinersValueBig = await contract.methods.calculateEggSell(eggs).call();
      const myMinersValue = parseFloat(rpc.utils.fromWei(myMinersValueBig, "ether"));
      const devFee = parseFloat(rpc.utils.fromWei(await contract.methods.devFee(myMinersValueBig).call(), "ether"));
      const withdrawable = myMinersValue - devFee;

      store.dispatch(set_withdrawable({ id: id, withdrawable: withdrawable }));
    }
  }
}

async function subscribe_mining_token(rpc: TRPC, currency: Currency) {
  const id = currency.id;
  const state = store.getState();
  const web3 = state.web3.provider;
  const wallet = state.web3.wallet;
  const contract = new web3.eth.Contract(token_abi as AbiItem[], currency.contract);
  const bitValue = await contract.methods.calculateBitSell(2592000).call();
  const bits = parseInt(await contract.methods.getBits().call({ from: wallet }));
  const shares = parseInt(await contract.methods.getShares().call({ from: wallet }));
  const timestamp_withdraw = parseInt(await contract.methods.getLastConvert().call({ from: wallet }));
  const allowance = await contract.methods.getAllowance().call({ from: wallet });
  const whitelisted = await contract.methods.whitelist(wallet).call({ from: wallet });

  store.dispatch(set_shares({ id: id, shares: shares }));

  if (wallet) {
    store.dispatch(set_timestamp_withdraw({ id: id, timestamp_withdraw: timestamp_withdraw }));
    store.dispatch(set_allowance({ id: id, allowance: allowance }));
    store.dispatch(set_whitelisted({ id: id, whitelisted: whitelisted }));

    if (shares > 0) {
      const shareValue = 1.05 * parseFloat(web3.utils.fromWei(bitValue, "ether"));
      const tvl = shareValue * shares;

      store.dispatch(set_tvl({ id: id, tvl: tvl }));
    }

    if (shares > 0 && bits > 0) {
      const sharesValueBig = await contract.methods.calculateBitSell(bits).call();
      const sharesValue = parseFloat(rpc.utils.fromWei(sharesValueBig, "ether"));
      const fee = parseFloat(rpc.utils.fromWei(await contract.methods.getFee(sharesValueBig).call(), "ether"));
      const withdrawable = sharesValue - fee;

      store.dispatch(set_withdrawable({ id: id, withdrawable: withdrawable }));
    }
  }
}

async function subscribe_shares_coin(rpc: TRPC, currency: Currency) {
  const id = currency.id;
  const contract = new rpc.eth.Contract(coin_abi as AbiItem[], currency.contract);
  const eggValue = await contract.methods.calculateEggSell(2592000).call();

  store.dispatch(set_shares_value({ id: id, value: rpc.utils.fromWei(eggValue, "ether") }));
}

async function subscribe_shares_token(rpc: TRPC, currency: Currency) {
  const id = currency.id;
  const contract = new rpc.eth.Contract(token_abi as AbiItem[], currency.contract);
  const bitValue = await contract.methods.calculateBitSell(2592000).call();


  store.dispatch(set_shares_value({ id: id, value: rpc.utils.fromWei(bitValue, "ether") }));
}

async function subscribe_referral_token(rpc: TRPC, currency: Currency) {
  const state: any = store.getState();
  const wallet = state.web3.wallet;

  if (wallet) {
    const contract = new rpc.eth.Contract(token_abi as AbiItem[], currency.contract);

    const referredBy = await contract.methods.getReferredBy(wallet).call();
    const level = parseInt(await contract.methods.getReferralLevel(wallet).call());
    const bitsReceived = await contract.methods.getReferredBitsReceived(wallet).call();
    const uses = parseInt(await contract.methods.getReferralUses(wallet).call());

    if (referredBy != "0x0000000000000000000000000000000000000000") store.dispatch(set_referredBy(referredBy));

    store.dispatch(set_level(level));
    store.dispatch(set_bitsReceived(bitsReceived));
    store.dispatch(set_uses(uses));

    if (bitsReceived != "" || bitsReceived != "0") {
      const selected = state.currency.selected;
      const map = state.currency.map;
      const exists: boolean = map.has(selected);

      if (exists) {
        const currency_detail: Currency = map.get(selected);
        const share_value = currency_detail.shares_value;
        const share_per_bit = await contract.methods.BIT_TO_CONVERT_1SHARE().call();
        // @ts-ignore
        const sharesReceived = parseFloat(rpc.utils.toBN(state.referral.bitsReceived).div(rpc.utils.toBN(share_per_bit)).toString());
        const tokensReceived = sharesReceived * parseFloat(share_value);

        store.dispatch(set_tokensReceived(tokensReceived));
      }
    }
  }
}

async function network_reset() {
  store.dispatch(reset());
  await subscribe_asset();
  store.dispatch(set_selected_first());
}
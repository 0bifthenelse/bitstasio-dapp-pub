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
  currencies
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
  set_referral,
} from '../redux/slice/currency';

import {
  update_left
} from '../redux/slice/activity';

import {
  compound,
  deposit,
  claim
} from './activity';

import store from '../redux/store';
import { AbiItem } from 'web3-utils';

export default async function subscribe(): Promise<void> {
  const blockNumber = await RPC.eth.getBlockNumber();

  store.dispatch(update_block(blockNumber));
  setInterval(subscribe_time_since_withdraw, 1000);

  subscribe_wallet();
  subscribe_time_since_withdraw();
  subscribe_activity();
  subscribe_ref();
  subscribe_network();
  subscribe_funds();
  subscribe_mining();
  subscribe_shares();

  setInterval(async () => {
    const blockNumber = await RPC.eth.getBlockNumber();
    const wallet = store.getState().web3.wallet;

    subscribe_wallet();
    subscribe_contract_balance();
    subscribe_shares();

    if (wallet) {
      subscribe_network();
      subscribe_funds();
      subscribe_ref();
      subscribe_mining();
      subscribe_miner(blockNumber);
    }

    store.dispatch(update_block(blockNumber));
  }, 3000);

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

async function subscribe_miner(blockNumber: number): Promise<void> {
  connection(async (rpc: TRPC) => {
    const block = await rpc.eth.getBlock(blockNumber, true);

    for (const transaction of block.transactions) {
      try {
        currencies((currency: CurrencyJSON) => {
          if (currency.coin) {
            const address = currency.contract;
            const hash = transaction?.hash;
            const input = transaction?.input;
            const from = transaction?.from;
            const to = transaction?.to;
            const is_valid = to && from && to == address;

            if (is_valid) {
              const is_hire = input.startsWith("0xdb663865");
              const is_withdraw = input.startsWith("0x3955f0fe");
              const is_compound = input.startsWith("0x3ec862a8");

              if (is_hire) deposit(transaction.hash, from, transaction.value);
              else if (is_withdraw) claim(hash, from, transaction.value);
              else if (is_compound) compound(hash, from);
            }
          }
        });
      } catch (error: any) {
      }
    }
  }, true);
}

async function subscribe_time_since_withdraw(): Promise<void> {
  function time_since_date(time: number) {
    const total = new Date().getTime() - (time * 1000);
    const seconds_raw = Math.floor((total / 1000) % 60);
    const minutes_raw = Math.floor((total / 1000 / 60) % 60);
    const hours_raw = Math.floor((total / (1000 * 60 * 60)) % 24);
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

async function subscribe_funds(): Promise<void> {
  currencies(async (currency: CurrencyJSON) => {
    if (currency.coin) await subscribe_funds_coin(currency);
    else await subscribe_funds_token(currency);
  });

}

async function subscribe_funds_coin(currency: CurrencyJSON) {
  connection(async (rpc: TRPC) => {
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
  }, currency.mainnet);
}

async function subscribe_funds_token(currency: CurrencyJSON) {
  connection(async (rpc: TRPC) => {
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
  }, currency.mainnet);
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

async function subscribe_ref(): Promise<void> {
  const urlParams = new URLSearchParams(location.search);
  const ref = urlParams.get('ref');

  store.dispatch(set_referral(ref));
}

async function subscribe_mining(): Promise<void> {
  currencies(async (currency: CurrencyJSON) => {
    try {
      if (currency.coin) await subscribe_mining_coin(currency);
      else await subscribe_mining_token(currency);
    } catch (error: any) {
    }
  });
}

async function subscribe_mining_coin(currency: CurrencyJSON) {
  connection(async (rpc: TRPC) => {
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
  }, currency.mainnet);
}

async function subscribe_mining_token(currency: CurrencyJSON) {
  connection(async (rpc: TRPC) => {
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
  }, currency.mainnet);
}

async function subscribe_shares() {
  currencies(async (currency: CurrencyJSON) => {
    try {
      if (currency.coin) await subscribe_shares_coin(currency);
      else await subscribe_shares_token(currency);
    } catch (error: any) { }
  });
}

async function subscribe_shares_coin(currency: CurrencyJSON) {
  connection(async (rpc: TRPC) => {
    const id = currency.id;
    const contract = new rpc.eth.Contract(coin_abi as AbiItem[], currency.contract);
    const eggValue = await contract.methods.calculateEggSell(2592000).call();

    store.dispatch(set_shares_value({ id: id, value: rpc.utils.fromWei(eggValue, "ether") }));
  }, currency.mainnet);
}

async function subscribe_shares_token(currency: CurrencyJSON) {
  connection(async (rpc: TRPC) => {
    const id = currency.id;
    const contract = new rpc.eth.Contract(token_abi as AbiItem[], currency.contract);
    const bitValue = await contract.methods.calculateBitSell(2592000).call();

    store.dispatch(set_shares_value({ id: id, value: rpc.utils.fromWei(bitValue, "ether") }));
  }, currency.mainnet);
}

async function network_reset() {
  store.dispatch(reset());
  await subscribe_funds();
  store.dispatch(set_selected_first());
}
import {
  coin_abi,
  token_abi
} from 'constant';

import connection from "../rpc";
import store from 'store';
import { AbiItem } from 'web3-utils';

import {
  currencies,
  selected_currency
} from 'utils/data';

import {
  set_tvl,
  set_shares,
  set_bits_per_share,
  set_shares_value,
  set_withdrawable,
  set_fees,
  set_allowance,
  set_timestamp_withdraw,
  set_currency
} from 'slice/currency';

export default async function subscribe_farms() {
  const wallet = store.getState().web3.wallet;

  await init_farms();

  if (wallet) {
    await subscribe_farm();
  }
}

async function init_farms(): Promise<void> {
  currencies(async (farm: Farm): Promise<void> => {
    if (farm.coin) await init_farms_coin(farm);
    else await init_farms_token(farm);
  });
}

async function subscribe_mining_coin(rpc: TRPC, currency: Farm) {
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
    store.dispatch(set_fees({ id: id, fees: 5 }));

    if (eggs > 0) {
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

async function subscribe_farm(): Promise<void> {
  selected_currency(async (currency: Farm) => {
    connection(async (rpc: TRPC) => {
      if (currency.coin) {
        await subscribe_shares_coin(rpc, currency);
        await subscribe_bits_per_share_coin(rpc, currency);
        await subscribe_mining_coin(rpc, currency);
      }

      else {
        await subscribe_shares_token(rpc, currency);
        await subscribe_bits_per_share_token(rpc, currency);
        await subscribe_mining_token(rpc, currency);
      }
    });
  });
}

async function subscribe_mining_token(rpc: TRPC, currency: Farm) {
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
  const fees = await contract.methods.feePerc().call();

  store.dispatch(set_shares({ id: id, shares: shares }));

  if (wallet) {
    store.dispatch(set_timestamp_withdraw({ id: id, timestamp_withdraw: timestamp_withdraw }));
    store.dispatch(set_allowance({ id: id, allowance: allowance }));
    store.dispatch(set_fees({ id: id, fees: fees }));

    if (bits > 0) {
      const shareValue = (1 + fees / 100) * parseFloat(web3.utils.fromWei(bitValue, "ether"));
      const tvl = shareValue * shares;

      store.dispatch(set_tvl({ id: id, tvl: tvl }));
    }

    if (shares > 0 && bits > 0) {
      const sharesValueBig = await contract.methods.calculateBitSell(bits).call();
      const sharesValue = parseFloat(rpc.utils.fromWei(sharesValueBig, "ether"));
      const fee = parseFloat(rpc.utils.fromWei(await contract.methods.getFee(sharesValueBig).call(), "ether"));
      const withdrawable = currency.name == "BTC" ? sharesValue * (1 - 0.111111) : sharesValue - fee;

      store.dispatch(set_withdrawable({ id: id, withdrawable: withdrawable }));
    }

    else {
      store.dispatch(set_withdrawable({ id: id, withdrawable: 0 }));
    }
  }
}

async function subscribe_shares_coin(rpc: TRPC, currency: Farm) {
  const id = currency.id;
  const contract = new rpc.eth.Contract(coin_abi as AbiItem[], currency.contract);
  const eggValue = await contract.methods.calculateEggSell(2592000).call();

  store.dispatch(set_shares_value({ id: id, value: rpc.utils.fromWei(eggValue, "ether") }));
}

async function subscribe_shares_token(rpc: TRPC, currency: Farm) {
  const id = currency.id;
  const contract = new rpc.eth.Contract(token_abi as AbiItem[], currency.contract);
  const bitValue = await contract.methods.calculateBitSell(2592000).call();

  store.dispatch(set_shares_value({ id: id, value: rpc.utils.fromWei(bitValue, "ether") }));
}

async function subscribe_bits_per_share_coin(rpc: TRPC, currency: Farm) {
  const id = currency.id;
  const contract = new rpc.eth.Contract(coin_abi as AbiItem[], currency.contract);
  const bits_per_share = await contract.methods.EGGS_TO_HATCH_1MINERS().call();

  store.dispatch(set_bits_per_share({ id: id, value: bits_per_share }));
}

async function subscribe_bits_per_share_token(rpc: TRPC, currency: Farm) {
  const id = currency.id;
  const contract = new rpc.eth.Contract(token_abi as AbiItem[], currency.contract);
  const bits_per_share = await contract.methods.BIT_TO_CONVERT_1SHARE().call();

  store.dispatch(set_bits_per_share({ id: id, value: bits_per_share }));
}

async function init_farms_coin(currency: Farm) {
  try {
    const state = store.getState();
    const chain_id = currency.chain_id;

    if (chain_id == state.web3.network) {
      const name = currency.name;
      const coin = currency.coin;
      const contract = currency.contract;
      const token_contract = "";
      const apr = currency.apr;
      const daily = currency.daily;

      const data = {
        id: currency.id,
        name: name,
        chain_id: chain_id,
        contract: contract,
        token_contract: token_contract,
        apr: apr,
        daily: daily,
        coin: coin
      };

      store.dispatch(set_currency(data));
    }
  } catch (error: any) { }
}

async function init_farms_token(currency: Farm) {
  try {
    const state = store.getState();
    const chain_id = currency.chain_id;

    if (chain_id == state.web3.network) {
      const name = currency.name;
      const coin = currency.coin;
      const contract = currency.contract;
      const token_contract = currency.token_contract;
      const apr = currency.apr;
      const daily = currency.daily;

      const data = {
        id: currency.id,
        name: name,
        chain_id: chain_id,
        contract: contract,
        token_contract: token_contract,
        apr: apr,
        daily: daily,
        coin: coin
      };

      store.dispatch(set_currency(data));
    }
  } catch (error: any) { }
}
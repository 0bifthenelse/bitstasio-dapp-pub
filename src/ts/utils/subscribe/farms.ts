import * as constants from 'constant';
import * as data from 'utils/data';
import fetch_abi from 'human-standard-token-abi';
import { matchPath } from 'react-router';

import connection from "../rpc";
import store from 'store';
import Farm from 'utils/arbitrator/farms';
import { AbiItem } from 'web3-utils';

import * as factory from 'slice/factory';

export default async function init(): Promise<void> {
  await Promise.all([
    init_farms(),
    internal(),
    external()
  ]);
}

async function init_farms(): Promise<void> {
  data.farms(async (farm: FarmJSON): Promise<void> => {
    if (farm.coin) await init_farms_coin(farm);
    else await init_farms_token(farm);
  });
}

async function init_farms_coin(farm: FarmJSON): Promise<void> {
  try {
    const state = store.getState();
    const chain_id = farm.chain_id;

    if (chain_id == state.web3.network) {
      const order = farm.order;
      const status = farm.status;
      const audit = farm.audit;
      const name = farm.name;
      const coin = farm.coin;
      const contract = farm.contract;
      const token_contract = "";
      const apr = farm.apr;
      const daily = farm.daily;

      const data = {
        order: order,
        audit: audit,
        name: name,
        chain_id: chain_id,
        contract: contract,
        token_contract: token_contract,
        apr: apr,
        daily: daily,
        coin: coin,
        status: status
      };

      store.dispatch(factory.set_farm(data));
    }
  } catch (error: any) { }
}

async function init_farms_token(farm: FarmJSON): Promise<void> {
  try {
    const state = store.getState();
    const chain_id = farm.chain_id;

    if (chain_id == state.web3.network) {
      const order = farm.order;
      const status = farm.status;
      const name = farm.name;
      const audit = farm.audit;
      const coin = farm.coin;
      const contract = farm.contract;
      const token_contract = farm.token_contract;
      const apr = farm.apr;
      const daily = farm.daily;

      const data = {
        order: order,
        audit: audit,
        name: name,
        chain_id: chain_id,
        contract: contract,
        token_contract: token_contract,
        apr: apr,
        daily: daily,
        coin: coin,
        status: status
      };

      store.dispatch(factory.set_farm(data));
    }
  } catch (error: any) { }
}

async function external(): Promise<void> {
  data.farms(async (farm: FarmJSON) => await external_data(farm));
}

async function external_data(farm: FarmJSON): Promise<void> {
  const balance = await Farm.get_contract_balance(farm.contract, farm.chain_id);
  const initialized = await Farm.get_initialized(farm.contract, farm.chain_id);

  store.dispatch(factory.set_contract_balance({ contract: farm.contract, contract_balance: balance }));
  store.dispatch(factory.set_initialized({ contract: farm.contract, initialized: initialized }));
}

async function internal(): Promise<void> {
  const [active, address]: [boolean, string] = (store.getState() as any).subscription.farms;
  const wallet = (store.getState() as any).web3.wallet;

  if (active && wallet) {
    const farm = (store.getState() as any).currency.farms.get(address);

    return internal_data(farm);
  }
}

async function internal_data(farm: FarmJSON): Promise<void> {
  const state = store.getState();
  const wallet = state.web3.wallet;
  const admin = await Farm.get_admin(farm.contract);
  const bit_value = await Farm.get_bit_value(farm.contract);
  const bits = await Farm.get_bits(farm.contract);
  const bits_per_share = await Farm.get_bits_per_share(farm.contract);
  const shares = await Farm.get_shares(farm.contract);
  const timestamp_withdraw = await Farm.get_timestamp_last_withdraw(farm.contract);
  const [fee_deposit, fee_withdraw] = await Farm.get_fees(farm.contract);

  store.dispatch(factory.set_admin({ contract: farm.contract, admin: admin }));
  store.dispatch(factory.set_fees({ contract: farm.contract, fees: { deposit: fee_deposit, withdraw: fee_withdraw } }));
  store.dispatch(factory.set_shares({ contract: farm.contract, shares: shares }));
  store.dispatch(factory.set_timestamp_withdraw({ contract: farm.contract, timestamp_withdraw: timestamp_withdraw }));
  store.dispatch(factory.set_bits_per_share({ contract: farm.contract, value: bits_per_share }));
  store.dispatch(factory.set_shares_value({ contract: farm.contract, value: bit_value }));

  if (wallet) {
    const tvl = await Farm.get_tvl(shares, bit_value);
    const bits_withdraw_value = await Farm.get_bits_withdraw_value(farm.contract, bits);
    const withdrawable = shares > 0 ? bits_withdraw_value * (1 - (fee_withdraw / 100)) : 0;

    store.dispatch(factory.set_tvl({ contract: farm.contract, tvl: tvl }));
    store.dispatch(factory.set_withdrawable({ contract: farm.contract, withdrawable: withdrawable }));
  }
}
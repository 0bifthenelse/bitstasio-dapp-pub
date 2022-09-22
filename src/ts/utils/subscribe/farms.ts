import * as data from 'utils/data';
import * as factory from 'slice/factory';
import store from 'store';
import FarmArbitrator from 'utils/arbitrator/farm';

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
  data.farms(async (farm: FarmJSON) => {
    if (farm) return external_data(farm);
  });
}

async function external_data(farm: FarmJSON): Promise<void> {
  const balance = await FarmArbitrator.get_contract_balance(farm.contract, farm.chain_id);
  const initialized = await FarmArbitrator.get_initialized(farm.contract, farm.chain_id);

  store.dispatch(factory.set_contract_balance({ contract: farm.contract, contract_balance: balance }));
  store.dispatch(factory.set_initialized({ contract: farm.contract, initialized: initialized }));
}

async function internal(): Promise<void> {
  const [active, address]: [boolean, string] = (store.getState() as any).subscription.farms;
  const wallet = (store.getState() as any).web3.wallet;

  if (active && wallet) {
    const farm = (store.getState() as any).currency.farms.get(address);

    if (farm) return internal_data(farm);
  }
}

async function internal_data(farm: FarmJSON): Promise<void> {
  const state = store.getState();
  const wallet = state.web3.wallet;

  const admin = await FarmArbitrator.get_admin(farm.contract);
  const bits = await FarmArbitrator.get_bits(farm.contract);
  const allowance = await FarmArbitrator.get_allowance(farm.coin, farm.contract, farm.token_contract);
  const shares = await FarmArbitrator.get_shares(farm.contract);
  const shares_percent = await FarmArbitrator.get_shares_percent(farm.contract);
  const timestamp_withdraw = await FarmArbitrator.get_timestamp_last_withdraw(farm.contract);
  const [fee_deposit, fee_withdraw] = await FarmArbitrator.get_fees(farm.contract);

  store.dispatch(factory.set_admin({ contract: farm.contract, admin: admin }));
  store.dispatch(factory.set_fees({ contract: farm.contract, fees: { deposit: fee_deposit, withdraw: fee_withdraw } }));
  store.dispatch(factory.set_shares({ contract: farm.contract, amount: shares }));
  store.dispatch(factory.set_shares_percent({ contract: farm.contract, percent: shares_percent }));
  store.dispatch(factory.set_timestamp_withdraw({ contract: farm.contract, timestamp_withdraw: timestamp_withdraw }));

  if (wallet) {
    const bits_withdraw_value = await FarmArbitrator.get_bits_withdraw_value(farm.contract, bits);
    const withdrawable = shares > 0 ? bits_withdraw_value * (1 - (fee_withdraw / 100)) : 0;

    store.dispatch(factory.set_withdrawable({ contract: farm.contract, withdrawable: withdrawable }));
    store.dispatch(factory.set_allowance({ contract: farm.contract, allowance: allowance }));
  }
}
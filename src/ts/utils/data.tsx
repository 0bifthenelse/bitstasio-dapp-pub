import React from 'react';
import store from "../redux/store";
import { AbiItem, toWei, fromWei } from 'web3-utils';
import {
  get_wallet_explorer
} from 'utils/rpc';

function importAll(r: any) {
  return r.keys().map(r);
}

// @ts-ignore
const farms_dir = importAll(require.context('./farms', true, /\.(json)$/));

// @ts-ignore
const currencies_dir = importAll(require.context('./currencies', true, /\.(json)$/));

// @ts-ignore
const gambling_dir = importAll(require.context('./gambling', true, /\.(json)$/));

// @ts-ignore
const dispatcher_dir = importAll(require.context('./dispatcher', true, /\.(json)$/));

export function farms(action: Function) {
  for (const index in farms_dir) {
    const farm = farms_dir[index];

    action(farm);
  }
}

export function balances(action: Function) {
  for (const index in currencies_dir) action(currencies_dir[index]);
}

export function get_farm(contract: string): FarmJSON {
  for (const index in farms_dir) {
    const farm = farms_dir[index];


    if (farm.contract === contract) return farm;
  }

  return null as unknown as FarmJSON;
}

export function get_abi(contract: string): AbiItem[] {
  // @ts-ignore
  return require('./abi/' + contract + '.json');
}

export function get_coin_balance(map: HashMap<string, Balance>, chain_id: number): number {
  if (map.entries().length > 0) {
    for (let i = 0; i < map.keys().length; i++) {
      const balance = map.values()[i];

      if (balance.chain_id == chain_id && balance.coin) return parseFloat(fromWei(balance.amount.toString(), "ether"));
    }
  }

  return 0;
}

export function get_token_balance(map: HashMap<string, Balance>, chain_id: number, address: string): number {
  if (map.entries().length > 0) {
    for (let i = 0; i < map.keys().length; i++) {
      const balance = map.values()[i];

      if (balance.chain_id == chain_id && !balance.coin && balance.address == address) return parseFloat(fromWei(balance.amount.toString(), "ether"));
    }
  }

  return 0;
}

export function get_wallet_link(address: string, short: boolean = true, chain_id: number = 56): JSX.Element {
  const address_str = short ? address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length) : address;
  const link = get_wallet_explorer(chain_id);

  return (
    <a href={`${link}${address}`} target="_blank" >{address_str}</a>
  );
}

export function get_jackpot(): JackpotJSON {
  const state: any = store.getState();
  const chain_id = state.web3.network;

  for (const index in gambling_dir) {
    const gambling = gambling_dir[index];

    if (gambling.name == "Jackpot" && gambling.chain_id == chain_id) return gambling;
  }

  return null as unknown as any;
}

export function get_dispatcher() {
  const state: any = store.getState();
  const chain_id = state.web3.network;

  for (const index in dispatcher_dir) {
    const dispatcher = dispatcher_dir[index];

    if (dispatcher.chain_id == chain_id) return dispatcher;
  }

  return null as unknown as any;
}

export function get_array_sorted_by_order(array: Array<any>): Array<any> {
  return array.length > 1 ? array.slice().sort((a, b) => a.order - b.order) : array;
}
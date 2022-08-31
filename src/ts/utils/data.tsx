import React from 'react';
import store from "../redux/store";
import { fromWei } from 'web3-utils';

import {
  jackpot_data
} from 'constant';

function importAll(r: any) {
  return r.keys().map(r);
}

// @ts-ignore
const farms_dir = importAll(require.context('./farms', true, /\.(json)$/));

// @ts-ignore
const currencies_dir = importAll(require.context('./currencies', true, /\.(json)$/));

export function currency(id: number) {
  for (const index in farms_dir) {
    const currency = farms_dir[index];

    if (currency.id == id) return currency;
  }

  return undefined;
}



export function currency_find(coin: boolean, address?: string): FarmJSON {
  if (coin) return currency_find_coin();
  else if (address) return currency_find_token(address);

  return null as unknown as FarmJSON;
}

function currency_find_coin(): FarmJSON {
  for (const index in farms_dir) {
    const currency = farms_dir[index];

    currency.id = parseInt(index);

    if (currency.coin == true) return currency;
  }

  return null as unknown as FarmJSON;
}

function currency_find_token(address: string): FarmJSON {
  for (const index in farms_dir) {
    const currency = farms_dir[index];

    currency.id = parseInt(index);

    if (currency.coin == false && currency.token_contract == address) return currency;
  }

  return null as unknown as FarmJSON;
}

export function currencies(action: Function) {
  for (const index in farms_dir) {
    const currency = farms_dir[index];
    currency.id = parseInt(index);

    action(currency);
  }
}

export function balances(action: Function) {
  for (const index in currencies_dir) action(currencies_dir[index]);
}

export function selected_currency(action: Function) {
  const state: any = store.getState();
  const map = state.currency.farms;
  const selected = state.currency.selected;

  if (map.has(selected)) return action(map.get(selected));
  else return;
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

export function get_wallet_link(address: string, short: boolean = true): JSX.Element {
  const address_str = short ? address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length) : address;

  return (
    <a href={`https://bscscan.com/address/${address}`} target="_blank" >{address_str}</a>
  );
}

export function get_jackpot_address(): string {
  const state: any = store.getState();
  const chain_id = state.web3.network;

  for (const jackpot of jackpot_data) {
    if (jackpot.chain_id == chain_id) return jackpot.address;
  }

  return "";
}
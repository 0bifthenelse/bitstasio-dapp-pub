import store from "../redux/store";

function importAll(r: any) {
  return r.keys().map(r);
}

// @ts-ignore
const currencies_dir = importAll(require.context('./currencies', true, /\.(json)$/));

export function currency(id: number) {
  for (const index in currencies_dir) {
    const currency = currencies_dir[index];

    if (currency.id == id) return currency;
  }

  return undefined;
}

export function currency_find(coin: boolean, address?: string): CurrencyJSON {
  if (coin) return currency_find_coin();
  else if (address) return currency_find_token(address);

  return null as unknown as CurrencyJSON;
}

function currency_find_coin(): CurrencyJSON {
  for (const index in currencies_dir) {
    const currency = currencies_dir[index];

    currency.id = parseInt(index);

    if (currency.coin == true) return currency;
  }

  return null as unknown as CurrencyJSON;
}

function currency_find_token(address: string): CurrencyJSON {
  for (const index in currencies_dir) {
    const currency = currencies_dir[index];

    currency.id = parseInt(index);

    if (currency.coin == false && currency.token_contract == address) return currency;
  }

  return null as unknown as CurrencyJSON;
}

export function currencies(action: Function) {
  for (const index in currencies_dir) {
    const currency = currencies_dir[index];
    currency.id = parseInt(index);

    action(currency);
  }
}

export function selected_currency(action: Function) {
  const state: any = store.getState();
  const map = state.currency.map;
  const selected = state.currency.selected;

  if (map.has(selected)) return action(map.get(selected));
  else return;
}
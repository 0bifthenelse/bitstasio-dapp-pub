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

export function currencies(action: Function) {
  for (const index in currencies_dir) {
    const currency = currencies_dir[index];
    currency.id = parseInt(index);

    action(currency);
  }
}
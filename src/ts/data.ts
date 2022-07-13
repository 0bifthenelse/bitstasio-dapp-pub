function importAll(r: any) {
  return r.keys().map(r);
}

// @ts-ignore
const contracts_dir = importAll(require.context('./data/contracts', true, /\.(json)$/));

// @ts-ignore
const sales_dir = importAll(require.context('./data/sales', true, /\.(json)$/));

export function contract(address: string) {
  for (const index in contracts_dir) {
    const contract = contracts_dir[index];

    if (contract.address == address) return contract;
  }

  return undefined;
}

export function contracts(action: Function) {
  contracts_dir.forEach((contract: Contract) => {
    return action(contract);
  });
}

export function sales(action: Function) {
  sales_dir.forEach((contract: Contract) => {
    return action(contract);
  });
}
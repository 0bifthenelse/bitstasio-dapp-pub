import Web3 from 'web3';
import store from 'store';

export default (action: Function) => {
  const state: any = store.getState();
  const network = state.web3.network ?? 0;
  const rpc = get_rpc(network);

  return action(rpc);
}

function get_rpc(chain_id: number): Web3 | null {
switch (chain_id) {
    case 56: return new Web3('https://bsc-dataseed.binance.org'); // BSC mainnet
    case 97: return new Web3('https://data-seed-prebsc-1-s1.binance.org:8545'); // BSC testnet
    default: return null;
  }
}

export function get_default_chain_id(): number {
  return 56;
}

export function is_network_supported(chain_id: number): boolean {
  switch (chain_id) {
    case 56: return true; // BSC mainnet
    case 97: return true; // BSC testnet
    case 137: return true; // Polygon mainnet
    case 80001: return true; // Polygon testnet
    default: return false;
  }
}
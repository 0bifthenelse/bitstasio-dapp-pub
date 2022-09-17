import Web3 from 'web3';
import store from 'store';

export default (action: Function) => {
  return action(get_rpc());
};

export function get_rpc(chain_id_override?: number): Web3 {
  const state: any = store.getState();
  const chain_id = chain_id_override ?? (state.web3.network ?? (state.web3.network ?? 0));

  switch (chain_id) {
    case 56: return new Web3('https://bsc-dataseed.binance.org'); // BSC mainnet
    case 97: return new Web3('https://data-seed-prebsc-1-s1.binance.org:8545'); // BSC testnet
    case 137: return new Web3('https://polygon-rpc.com'); // Polygon mainnet
    case 80001: return new Web3('https://rpc-mumbai.maticvigil.com'); // Polygon testnet
    default: return new Web3('https://bsc-dataseed.binance.org');
  }
}

export function get_default_chain_id(): number {
  return 56;
}

export function get_blockchain_coin_name(chain_id: number): string {
  let blockchain: string;

  switch (chain_id) {
    case 56: { blockchain = "BNB"; break; }
    case 97: { blockchain = "BNB"; break; }
    case 137: { blockchain = "MATIC"; break; }
    case 80001: { blockchain = "MATIC"; break; }
    default: { blockchain = "BNB"; break; }
  }

  return blockchain;
}

export function get_blockchain(chain_id: number): string {
  let blockchain: string;

  switch (chain_id) {
    case 56: { blockchain = "BNB Smart Chain"; break; }
    case 97: { blockchain = "BNB Smart Chain testnet"; break; }
    case 137: { blockchain = "Polygon"; break; }
    case 80001: { blockchain = "Polygon testnet"; break; }
    default: { blockchain = "BNB Smart Chain"; break; }
  }

  return blockchain;
}

export function get_blockchain_icon(chain_id: number): string {
  let icon: string;

  switch (chain_id) {
    case 56: { icon = "/img/blockchain/bsc.png"; break; }
    case 97: { icon = "/img/blockchain/bsc.png"; break; }
    case 137: { icon = "/img/blockchain/polygon.png"; break; }
    case 80001: { icon = "/img/blockchain/polygon.png"; break; }
    default: { icon = "/img/blockchain/bsc.png"; break; }
  }

  return icon;
}

export function get_wallet_explorer(chain_id: number): string {
  let link: string;

  switch (chain_id) {
    case 56: { link = "https://bscscan.com/address/"; break; }
    case 97: { link = "https://testnet.bscscan.com/address/"; break; }
    case 137: { link = "https://polygonscan.com/address/"; break; }
    case 80001: { link = "https://mumbai.polygonscan.com/address/"; break; }
    default: { link = "https://bscscan.com/address/"; break; }
  }

  return link;
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
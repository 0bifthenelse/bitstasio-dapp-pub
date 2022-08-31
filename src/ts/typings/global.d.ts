import Web3 from "web3";
import HashMap from 'hashmap';

export { };

declare global {
  type Watcher = HashMap<string, Watch>;
  type Menu = DOMRect;
  type ActivityOrigin = "compound" | "deposit" | "claim";
  type TRPC = Web3;
  type Anchor = 'top' | 'left' | 'bottom' | 'right';

  interface ProductProps {
    data: {
      name: string;
      url: string;
      active: boolean;
      description: string;
      icon: string;
      close?: Function;
    };
  }

  interface ToolProps {
    data: {
      name: string;
      url: string;
      active: boolean;
      external: boolean;
      close?: Function;
    };
  }

  interface SocialProps {
    data: {
      name: string;
      description: string;
      url: string;
      close?: Function;
    };
  }

  interface Farm {
    id: number;
    name: string;
    chain_id: number;
    investment: string;
    fees: number;
    tvl: number;
    apr: number;
    shares: number;
    daily: string;
    coin: boolean;
    allowance: string;
    bits_per_share: number;
    shares_value: string;
    shares_to_receive: number;
    token_contract: string;
    contract: string;
    contract_balance: string;
    withdrawable: number;
    whitelisted: boolean;
    timestamp_withdraw: number;
    time_since_withdraw: string;
    launch_block: number;
  }

  interface FarmJSON {
    id: number;
    active: boolean;
    name: string;
    chain_id: number;
    mainnet: boolean;
    apr: string;
    daily: string;
    coin: boolean;
    contract: string;
    token_contract: string;
    whitelist: boolean;
    launch_block: number;
  }

  interface Balance {
    name: string;
    coin: boolean;
    chain_id: number;
    amount: number;
    address?: string;
  }

interface BalanceJSON {
    name: string;
    chain_id: number;
    coin: boolean;
    address?: string;
  }


  interface Activity {
    active: boolean;
    position: number;
    hash: string;
    origin: ActivityOrigin;
    from: string;
    value: string;
    left: number;
  }

  interface Watch {
    name: string;
    symbol: string;
    contract: string;
    pair: string;
    record: {
      trust: boolean;
      scam: boolean;
    };
  }

  interface Social {
    name: string;
    url: string;
  }

  interface Contract {
    name: string;
    description: string;
    symbol: string;
    nano: boolean;
    decimals: number;
    address: string;
    abi: Array<any>;
    pair: string;
    socials: Array<Social>;
    order: number;
    logo: string;
  }

  interface Sale {
    active: boolean;
    description: string;
    order: number;
    address: string;
    token_address: string;
    nature: string;
    abi: any;
  }

  interface Jackpot {
    active: boolean;
    round: number;
    last_deposit: string;
    remaining_blocks: number;
  }

  interface JackpotHistory {
    wallet: string;
    block_number: string;
    prize: number;
  }
}
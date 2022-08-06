import Web3 from "web3";
import HashMap from 'hashmap';

export { };

declare global {
  type Watcher = HashMap<string, Watch>;
  type Menu = DOMRect;
  type ActivityOrigin = "compound" | "deposit" | "claim";
  type TRPC = Web3;

  interface Currency {
    id: number;
    name: string;
    amount: number;
    mainnet: boolean;
    investment: string;
    tvl: number;
    apr: number;
    shares: number;
    daily: string;
    coin: boolean;
    allowance: string;
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

  interface CurrencyJSON {
    id: number;
    name: string;
    mainnet: boolean;
    apr: string;
    daily: string;
    coin: boolean;
    contract: string;
    token_contract: string;
    whitelist: boolean;
    launch_block: number;
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
}
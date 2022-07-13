import Web3 from "web3";

export { };

declare global {
  type Watcher = HashMap<string, Watch>;
  type Menu = DOMRect;

  interface Watch {
    name: string;
    symbol: string;
    contract: string;
    pair: string;
    record: {
      trust: boolean;
      scam: boolean;
    }
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
import { AbiItem, toWei, fromWei } from 'web3-utils';
import BN from 'bn.js';
import fetch_abi from 'human-standard-token-abi';
import * as data from 'utils/data';
import { get_rpc } from "utils/rpc";
import store from 'store';
import Arbitrator from 'utils/arbitrator';

export default class Farms extends Arbitrator {
  static SUPPRESSED_REFERRAL = "0x000000000000000000000000000000000000dEaD";

  static async get_contract_balance(address: string, chain_id: number): Promise<number> {
    try {
      const rpc = get_rpc(chain_id);
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return parseFloat(fromWei(await contract.methods.getBalance().call()));
        default: return parseFloat(fromWei(await contract.methods.getBalance().call()));
      }
    } catch (_) {
      return 0;
    }
  }

  static async get_initialized(address: string, chain_id: number): Promise<number> {
    try {
      const rpc = get_rpc(chain_id);
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return contract.methods.initialized().call();
    } catch (_) {
      return 0;
    }
  }

  static async get_shares(address: string): Promise<number> {
    try {
      const wallet = store.getState().web3.wallet;
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return parseInt(await contract.methods.getMyMiners().call({ from: wallet }));
        default: return parseInt(await contract.methods.getShares().call({ from: wallet }));
      }
    } catch (_) {
      return 0;
    }
  }

  static async get_allowance(coin: boolean, address: string, token_address: string): Promise<string> {
    try {
      const wallet = store.getState().web3.wallet;
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(fetch_abi as AbiItem[], token_address);

      switch (true) {
        case coin: return "0";
        default: return contract.methods.allowance(wallet, address).call();
      }
    } catch (_) {
      return "0";
    }
  }

  static async get_tvl(shares_balance: number, bit_value: BN): Promise<number> {
    try {
      const value = parseFloat(fromWei(bit_value.toString(), "ether"));

      return value * shares_balance;
    } catch (_) {
      return 0;
    }
  }

  static async get_bits_withdraw_value(address: string, balance: number): Promise<number> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return parseFloat(fromWei(await contract.methods.calculateEggSell(balance).call(), "ether"));
        default: return parseFloat(fromWei(await contract.methods.calculateBitSell(balance).call(), "ether"));
      }
    } catch (_) {
      return 0;
    }
  }

  static async get_bits(address: string): Promise<number> {
    try {
      const wallet = store.getState().web3.wallet;
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return parseInt(await contract.methods.getMyEggs().call({ from: wallet }));
        default: return parseInt(await contract.methods.getBits().call({ from: wallet }));
      }
    } catch (_) {
      return 0;
    }
  }

  static async get_bits_per_share(address: string): Promise<number> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return contract.methods.EGGS_TO_HATCH_1MINERS().call();
        default: return contract.methods.BIT_TO_CONVERT_1SHARE().call();
      }
    } catch (_) {
      return 0;
    }
  }

  static async get_bit_value(address: string): Promise<BN> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return contract.methods.calculateEggSell(2592000).call();
        default: return contract.methods.calculateBitSell(2592000).call();
      }
    } catch (_) {
      return new BN("0");
    }
  }

  static async get_timestamp_last_withdraw(address: string): Promise<number> {
    try {
      const wallet = store.getState().web3.wallet;
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return parseInt(await contract.methods.lastHatch(wallet).call({ from: wallet }));
        default: return parseInt(await contract.methods.getLastConvert().call({ from: wallet }));
      }
    } catch (_) {
      return 0;
    }
  }

  static async get_fees(address: string): Promise<[number, number]> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return [5, 5];
        case address == "0x61DFFF79c52062bA60236FdA04fA8C32DB5e78a1": {
          const fee_deposit = await contract.methods.feePerc().call();
          const fee_withdraw = fee_deposit * 2;

          return [fee_deposit, fee_withdraw];
        }
        default: {
          const fee_deposit = (await contract.methods.FEE_DEPOSIT().call()) / 100;
          const fee_withdraw = (await contract.methods.FEE_WITHDRAW().call()) / 100;

          return [fee_deposit, fee_withdraw];
        }
      }
    } catch (_) {
      return [0, 0];
    }
  }

  static async get_admin(address: string): Promise<BN> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return contract.methods.ceoAddress().call();
        default: return contract.methods.admin().call();
      }
    } catch (_) {
      return new BN("0");
    }
  }

  static async send_deposit(coin: boolean, spend: string, address: string, loading_state: Function): Promise<void> {
    try {
      const state = store.getState();
      const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);
      const value = toWei(spend, "ether");

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return this.execute(contract.methods.buyEggs(this.SUPPRESSED_REFERRAL).send, { from: state.web3.wallet, value: value }, loading_state);
        case address == "0x61DFFF79c52062bA60236FdA04fA8C32DB5e78a1": return this.execute(contract.methods.buyBits(this.SUPPRESSED_REFERRAL, value).send, { from: state.web3.wallet }, loading_state);
        case coin: return this.execute(contract.methods.buyBits().send, { from: state.web3.wallet, value: spend }, loading_state);
        default: return this.execute(contract.methods.buyBits(value).send, { from: state.web3.wallet }, loading_state);
      }
    } catch (_) { }
  }

  static async send_withdraw(address: string, loading_state: Function): Promise<void> {
    try {
      const state = store.getState();
      const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return this.execute(contract.methods.sellEggs().send, { from: state.web3.wallet }, loading_state);
        default: return this.execute(contract.methods.sellBits().send, { from: state.web3.wallet }, loading_state);
      }
    } catch (_) { }
  }

  static async send_compound(address: string, loading_state: Function): Promise<void> {
    try {
      const state = store.getState();
      const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);

      switch (true) {
        case address == "0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c": return this.execute(contract.methods.hatchEggs(this.SUPPRESSED_REFERRAL).send, { from: state.web3.wallet }, loading_state);
        case address == "0x61DFFF79c52062bA60236FdA04fA8C32DB5e78a1": return this.execute(contract.methods.compoundBits(this.SUPPRESSED_REFERRAL).send, { from: state.web3.wallet }, loading_state);
        default: return this.execute(contract.methods.compoundBits().send, { from: state.web3.wallet }, loading_state);
      }
    } catch (_) { }
  }

  static async send_approve(address: string, token_address: string, value: string, loading_state: Function): Promise<void> {
    try {
      const state = store.getState();
      const wallet = state.web3.wallet;
      const contract = new state.web3.provider.eth.Contract(fetch_abi as AbiItem[], token_address);

      return this.execute(contract.methods.approve(address, value).send, { from: wallet }, loading_state);
    } catch (_) { }
  }
}
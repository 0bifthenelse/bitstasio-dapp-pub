import { fromWei, toWei } from 'web3-utils';
import BN from 'bn.js';
import * as data from 'utils/data';
import { get_rpc } from "utils/rpc";
import store from 'store';
import Arbitrator from 'utils/arbitrator';

export default class Farms extends Arbitrator {
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
}
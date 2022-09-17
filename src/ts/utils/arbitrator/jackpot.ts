import { fromWei, toWei } from 'web3-utils';
import * as data from 'utils/data';
import { get_rpc } from "utils/rpc";
import store from 'store';
import Arbitrator from 'utils/arbitrator';

export default class Jackpot extends Arbitrator {
  static get_json(): JackpotJSON {
    return data.get_jackpot();
  }

  static async get_balance(address: string): Promise<number> {
    try {
      const rpc = get_rpc();

      return parseFloat(fromWei(await rpc.eth.getBalance(address), "ether"));
    } catch (_) {
      return 0;
    }
  }

  static async get_active(address: string): Promise<boolean> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return await contract.methods.active().call();
    } catch (_) {
      return false;
    }
  }

  static async get_round(address: string): Promise<number> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return await contract.methods.round().call();
    } catch (_) {
      return 0;
    }
  }

  static async get_last_deposit(address: string): Promise<string> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return await contract.methods.lastDepositWallet().call();
    } catch (_) {
      return "0x0000000000000000000000000000000000000000";
    }
  }

  static async get_remaining_blocks(address: string): Promise<number> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return await contract.methods.getRemainingBlocks().call();
    } catch (_) {
      return 0;
    }
  }

  static async get_blocks_to_win(address: string): Promise<number> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return await contract.methods.BLOCKS_TO_WIN().call();
    } catch (_) {
      return 0;
    }
  }

  static async get_victory(address: string): Promise<boolean> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return await contract.methods.getIsVictory().call();
    } catch (_) {
      return false;
    }
  }

  static async get_admin(address: string): Promise<string> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);

      return await contract.methods.admin().call();
    } catch (_) {
      return "0x0000000000000000000000000000000000000000";
    }
  }

  static async get_min_max(address: string): Promise<[number, number]> {
    try {
      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);
      const min = parseFloat(fromWei(await contract.methods.MIN_DEPOSIT().call(), "ether"));
      const max = parseFloat(fromWei(await contract.methods.MAX_DEPOSIT().call(), "ether"));

      return [min, max];
    } catch (_) {
      return [0, 0];
    }
  }

  static async get_history(address: string): Promise<Array<JackpotHistory>> {
    try {
      let history: Array<JackpotHistory> = [];

      const rpc = get_rpc();
      const contract = new rpc.eth.Contract(data.get_abi(address), address);
      const winners = await contract.methods.getWinnerHistory().call();

      for (let i = 0; i < winners.length; i++) {
        const winner = winners[i];

        history.push({
          wallet: winner.wallet,
          block_number: winner.blockNumber,
          prize: parseFloat(fromWei(winner.prize, "ether"))
        });
      }

      return history;
    } catch (_) {
      return [] as Array<JackpotHistory>;
    }
  }

  static async send_deposit(address: string, value: number, loading_state: Function): Promise<void> {
    try {
      const state = store.getState();
      const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);

      await this.execute(contract.methods.participate().send, { from: state.web3.wallet, value: toWei(value.toString(), "ether") }, loading_state);
    } catch (_) { }
  }

  static async send_start(address: string, loading_state: Function): Promise<void> {
    try {
      const state = store.getState();
      const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);

      await this.execute(contract.methods.start().send, { from: state.web3.wallet }, loading_state);
    } catch (_) { }
  }

  static async send_claim(address: string, loading_state: Function): Promise<void> {
    try {
      const state = store.getState();
      const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);

      await this.execute(contract.methods.win().send, { from: state.web3.wallet }, loading_state);
    } catch (_) { }
  }
}
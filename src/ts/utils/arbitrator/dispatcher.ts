import { fromWei, toWei } from 'web3-utils';
import * as data from 'utils/data';
import { get_rpc } from "utils/rpc";
import store from 'store';
import Arbitrator from 'utils/arbitrator';

export default class Dispatcher extends Arbitrator {
  static authorized: Array<string> = [
    "0x9C9e373C794aE23b0e7a0EB95e8390F80C121E7E",
    "0x13597E348F0FcA622FAA606358294e5f2d9ebF1F"
  ];

  static async get_balance(): Promise<number> {
    try {
      const state: any = store.getState();
      const dispatcher = data.get_dispatcher();

      return parseFloat(fromWei(await new state.web3.provider.eth.getBalance(dispatcher.contract), "ether"));
    } catch (_) {
      return 0;
    }
  }

  static get_authorized(): boolean {
    try {
      const state: any = store.getState();
      const wallet = state.web3.wallet;

      if (wallet) return this.authorized.includes(wallet);

      return false;
    } catch (_) {
      return false;
    }
  }

  static async send_dispatch(loading_state: Function): Promise<void> {
    try {
      const state: any = store.getState();
      const dispatcher = data.get_dispatcher();
      const abi = data.get_abi(dispatcher.contract);
      const contract = new state.web3.provider.eth.Contract(abi, dispatcher.contract);

      return this.execute(contract.methods.dispatch().send, { from: state.web3.wallet }, loading_state);
    } catch (_) { }
  }
}
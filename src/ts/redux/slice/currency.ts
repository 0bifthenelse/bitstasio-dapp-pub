import { createSlice } from '@reduxjs/toolkit';
import HashMap from "hashmap";
import { coin_abi } from '../../constants';

export const slice_currency: any = createSlice({
  name: 'slice_currency',
  initialState: {
    opened: false,
    referral: "",
    selected: 0,
    map: new HashMap<number, Currency>
  },
  reducers: {
    reset: (state) => {
      state.opened = false;
      state.selected = 0;
      state.map = new HashMap<number, Currency>;
    },
    toggle_opened: (state) => {
      state.opened = !state.opened;
    },
    set_currency: (state, action) => {
      const id = action.payload.id;
      const name = action.payload.name;
      const mainnet = action.payload.mainnet;
      const contract = action.payload.contract;
      const token_contract = action.payload.token_contract;
      const apr = action.payload.apr;
      const coin = action.payload.coin;
      const daily = action.payload.daily;
      const launch_block = action.payload.launch_block;
      const map = state.map;

      if (!state.map.has(id)) {
        const data = {
          id: id,
          name: name,
          amount: 0,
          investment: "",
          mainnet: mainnet,
          shares: 0,
          coin: coin,
          apr: apr,
          token_contract: token_contract,
          contract: contract,
          shares_value: "0",
          daily: daily,
          tvl: 0,
          withdrawable: 0,
          whitelisted: false,
          allowance: "0",
          shares_to_receive: 0,
          time_since_withdraw: "---",
          timestamp_withdraw: 0,
          launch_block: launch_block,
          contract_balance: "0"
        };

        map.set(id, data);
        state.map = map.clone();
      }
    },
    set_amount: (state, action) => {
      const id = action.payload.id;
      const amount = action.payload.amount;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency) {
        currency.amount = amount;

        state.map = map.clone();
      }
    },
    set_investment: (state, action) => {
      const id = action.payload.id;
      const investment = action.payload.investment;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && investment >= 0) {
        currency.investment = investment;

        state.map = map.clone();
      }
    },
    set_shares: (state, action) => {
      const id = action.payload.id;
      const shares = action.payload.shares;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && shares >= 0) {
        currency.shares = shares;

        state.map = map.clone();
      }
    },
    set_shares_to_receive: (state, action) => {
      const id = action.payload.id;
      const to_receive = action.payload.to_receive;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && to_receive >= 0) {
        currency.shares_to_receive = to_receive;

        state.map = map.clone();
      }
    },
    set_shares_value: (state, action) => {
      const id = action.payload.id;
      const value = action.payload.value;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && value >= 0) {
        currency.shares_value = value;

        state.map = map.clone();
      }
    },
    set_tvl: (state, action) => {
      const id = action.payload.id;
      const tvl = action.payload.tvl;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && tvl >= 0) {
        currency.tvl = tvl;

        state.map = map.clone();
      }
    },
    set_timestamp_withdraw: (state, action) => {
      const id = action.payload.id;
      const timestamp_withdraw = action.payload.timestamp_withdraw;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && timestamp_withdraw >= 0) {
        currency.timestamp_withdraw = timestamp_withdraw;

        state.map = map.clone();
      }
    },
    set_time_since_withdraw: (state, action) => {
      const id = action.payload.id;
      const time_since_withdraw = action.payload.time_since_withdraw;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && time_since_withdraw) {
        currency.time_since_withdraw = time_since_withdraw;

        state.map = map.clone();
      }
    },
    set_withdrawable: (state, action) => {
      const id = action.payload.id;
      const withdrawable = action.payload.withdrawable;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && withdrawable >= 0) {
        currency.withdrawable = withdrawable;

        state.map = map.clone();
      }
    },
    set_whitelisted: (state, action) => {
      const id = action.payload.id;
      const whitelisted = action.payload.whitelisted;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && whitelisted != null) {
        currency.whitelisted = whitelisted;

        state.map = map.clone();
      }
    },
    set_allowance: (state, action) => {
      const id = action.payload.id;
      const allowance = action.payload.allowance;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency && allowance >= 0) {
        currency.allowance = allowance;

        state.map = map.clone();
      }
    },
    set_contract_balance: (state, action) => {
      const id = action.payload.id;
      const map = state.map;
      const currency = state.map.get(id);

      if (currency) {
        currency.contract_balance = action.payload.contract_balance;

        state.map = map.clone();
      }
    },
    set_selected: (state, action) => {
      state.selected = action.payload;
    },
    set_selected_first: (state) => {
      state.selected = state.map.keys()[0];
    },
    set_referral: (state, action) => {
      state.referral = action.payload;
    }
  }
});

export const {
  reset,
  toggle_opened,
  set_currency,
  set_amount,
  set_investment,
  set_shares,
  set_shares_to_receive,
  set_shares_value,
  set_tvl,
  set_withdrawable,
  set_whitelisted,
  set_allowance,
  set_time_since_withdraw,
  set_timestamp_withdraw,
  set_contract_balance,
  set_selected,
  set_selected_first,
  set_referral
} = slice_currency.actions;
export type RootState = ReturnType<typeof slice_currency.reducer>;
export default slice_currency.reducer;
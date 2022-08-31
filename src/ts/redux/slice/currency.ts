import { createSlice } from '@reduxjs/toolkit';
import HashMap from "hashmap";

export const slice_currency: any = createSlice({
  name: 'slice_currency',
  initialState: {
    opened: false,
    balance: new HashMap<string, Balance>,
    selected: 0,
    farms: new HashMap<number, Farm>
  },
  reducers: {
    reset: (state) => {
      state.opened = false;
      state.selected = 0;
      state.farms = new HashMap<number, Farm>;
    },
    toggle_opened: (state) => {
      state.opened = !state.opened;
    },
    set_balance: (state, action) => {
      const name = action.payload.name;
      const chain_id = action.payload.chain_id;
      const amount = action.payload.amount;
      const coin = action.payload.coin;
      const address = action.payload.address;
      const map = state.balance;
      const balance: Balance = {
        name: name,
        chain_id: chain_id,
        amount: amount,
        coin: coin,
        address: coin ? "" : address
      };

      map.set(name, balance);

      state.balance = map.clone();
    },
    set_currency: (state, action) => {
      const id = action.payload.id;
      const name = action.payload.name;
      const chain_id = action.payload.chain_id;
      const contract = action.payload.contract;
      const token_contract = action.payload.token_contract;
      const apr = action.payload.apr;
      const coin = action.payload.coin;
      const daily = action.payload.daily;
      const map = state.farms;

      if (!state.farms.has(id)) {
        const data = {
          id: id,
          name: name,
          chain_id: chain_id,
          investment: "",
          shares: 0,
          coin: coin,
          apr: apr,
          token_contract: token_contract,
          contract: contract,
          bits_per_share: 0,
          shares_value: "0",
          fees: 0,
          daily: daily,
          tvl: 0,
          withdrawable: 0,
          whitelisted: false,
          allowance: "0",
          shares_to_receive: 0,
          time_since_withdraw: "---",
          timestamp_withdraw: 0,
          launch_block: 0, // dead code
          contract_balance: "0"
        };

        map.set(id, data);
        state.farms = map.clone();
        state.selected = state.farms.keys()[0];
      }
    },
    set_investment: (state, action) => {
      const id = action.payload.id;
      const investment = action.payload.investment;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && investment >= 0) {
        currency.investment = investment;

        state.farms = map.clone();
      }
    },
    set_shares: (state, action) => {
      const id = action.payload.id;
      const shares = action.payload.shares;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && shares >= 0) {
        currency.shares = shares;

        state.farms = map.clone();
      }
    },
    set_shares_to_receive: (state, action) => {
      const id = action.payload.id;
      const to_receive = action.payload.to_receive;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency) {
        currency.shares_to_receive = to_receive;

        state.farms = map.clone();
      }
    },
    set_fees: (state, action) => {
      const id = action.payload.id;
      const fees = action.payload.fees;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency) {
        currency.fees = fees;

        state.farms = map.clone();
      }
    },
    set_bits_per_share: (state, action) => {
      const id = action.payload.id;
      const value = action.payload.value;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && value >= 0) {
        currency.bits_per_share = value;

        state.farms = map.clone();
      }
    },
    set_shares_value: (state, action) => {
      const id = action.payload.id;
      const value = action.payload.value;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && value >= 0) {
        currency.shares_value = value;

        state.farms = map.clone();
      }
    },
    set_tvl: (state, action) => {
      const id = action.payload.id;
      const tvl = action.payload.tvl;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && tvl >= 0) {
        currency.tvl = tvl;

        state.farms = map.clone();
      }
    },
    set_timestamp_withdraw: (state, action) => {
      const id = action.payload.id;
      const timestamp_withdraw = action.payload.timestamp_withdraw;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && timestamp_withdraw >= 0) {
        currency.timestamp_withdraw = timestamp_withdraw;

        state.farms = map.clone();
      }
    },
    set_time_since_withdraw: (state, action) => {
      const id = action.payload.id;
      const time_since_withdraw = action.payload.time_since_withdraw;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && time_since_withdraw) {
        currency.time_since_withdraw = time_since_withdraw;

        state.farms = map.clone();
      }
    },
    set_withdrawable: (state, action) => {
      const id = action.payload.id;
      const withdrawable = action.payload.withdrawable;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && withdrawable >= 0) {
        currency.withdrawable = withdrawable;

        state.farms = map.clone();
      }
    },
    set_whitelisted: (state, action) => {
      const id = action.payload.id;
      const whitelisted = action.payload.whitelisted;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && whitelisted != null) {
        currency.whitelisted = whitelisted;

        state.farms = map.clone();
      }
    },
    set_allowance: (state, action) => {
      const id = action.payload.id;
      const allowance = action.payload.allowance;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency && allowance >= 0) {
        currency.allowance = allowance;

        state.farms = map.clone();
      }
    },
    set_contract_balance: (state, action) => {
      const id = action.payload.id;
      const map = state.farms;
      const currency = state.farms.get(id);

      if (currency) {
        currency.contract_balance = action.payload.contract_balance;

        state.farms = map.clone();
      }
    },
    set_selected: (state, action) => {
      state.selected = action.payload;
    }
  }
});

export const {
  reset,
  toggle_opened,
  set_currency,
  set_balance,
  set_investment,
  set_shares,
  set_shares_to_receive,
  set_bits_per_share,
  set_shares_value,
  set_tvl,
  set_fees,
  set_withdrawable,
  set_whitelisted,
  set_allowance,
  set_time_since_withdraw,
  set_timestamp_withdraw,
  set_contract_balance,
  set_selected,
  set_selected_first
} = slice_currency.actions;
export type RootState = ReturnType<typeof slice_currency.reducer>;
export default slice_currency.reducer;
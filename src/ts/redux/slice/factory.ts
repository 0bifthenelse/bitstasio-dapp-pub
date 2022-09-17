import { createSlice } from '@reduxjs/toolkit';
import HashMap from "hashmap";

export const slice_currency: any = createSlice({
  name: 'slice_currency',
  initialState: {
    opened: false,
    balance: new HashMap<string, Balance>,
    farms: new HashMap<string, Farm>
  },
  reducers: {
    reset: (state) => {
      state.opened = false;
      state.farms = new HashMap<string, Farm>;
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

      if (
        (map.has(address) && map.get(address)?.amount != balance.amount)
        || (!map.has(address))
      ) {
        map.set(address, balance);

        state.balance = map.clone();
      }
    },
    set_farm: (state, action) => {
      const order = action.payload.order;
      const status = action.payload.status;
      const audit = action.payload.audit;
      const name = action.payload.name;
      const chain_id = action.payload.chain_id;
      const contract = action.payload.contract;
      const token_contract = action.payload.token_contract;
      const apr = action.payload.apr;
      const coin = action.payload.coin;
      const daily = action.payload.daily;
      const map = state.farms;

      if (!state.farms.has(contract)) {
        const data = {
          order: order,
          admin: "0x0000000000000000000000000000000000000000",
          change: 0,
          audit: audit,
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
          fees: {
            deposit: 0,
            withdraw: 0
          },
          daily: daily,
          tvl: 0,
          withdrawable: 0,
          whitelisted: false,
          allowance: "0",
          shares_to_receive: 0,
          time_since_withdraw: "---",
          timestamp_withdraw: 0,
          contract_balance: "0",
          launch_block: 0,
          initialized: false,
          status: status
        };

        map.set(contract, data);
        state.farms = map.clone();
      }
    },
    set_investment: (state, action) => {
      const contract = action.payload.contract;
      const investment = action.payload.investment;
      const map = state.farms;
      const currency = state.farms.get(contract);

      if (currency && investment >= 0) {
        currency.investment = investment;

        state.farms = map.clone();
      }
    },
    set_admin: (state, action) => {
      const contract = action.payload.contract;
      const admin = action.payload.admin;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && farm.admin != admin) {
        farm.admin = admin;

        state.farms = map.clone();
      }
    },
    set_shares: (state, action) => {
      const contract = action.payload.contract;
      const shares = action.payload.shares;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && shares >= 0 && farm.shares != shares) {
        farm.shares = shares;

        state.farms = map.clone();
      }
    },
    set_shares_to_receive: (state, action) => {
      const contract = action.payload.contract;
      const to_receive = action.payload.to_receive;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && farm.shares_to_receive != to_receive) {
        farm.shares_to_receive = to_receive;

        state.farms = map.clone();
      }
    },
    set_fees: (state, action) => {
      const contract = action.payload.contract;
      const fees = action.payload.fees;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && farm.fees != fees) {
        farm.fees = fees;

        state.farms = map.clone();
      }
    },
    set_bits_per_share: (state, action) => {
      const contract = action.payload.contract;
      const value = action.payload.value;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && value >= 0 && farm.bits_per_share != value) {
        farm.bits_per_share = value;

        state.farms = map.clone();
      }
    },
    set_shares_value: (state, action) => {
      const contract = action.payload.contract;
      const value = action.payload.value;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && value >= 0 && farm.shares_value != value) {
        farm.shares_value = value;

        state.farms = map.clone();
      }
    },
    set_tvl: (state, action) => {
      const contract = action.payload.contract;
      const tvl = action.payload.tvl;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && tvl >= 0 && farm.tvl != tvl) {
        farm.tvl = tvl;

        state.farms = map.clone();
      }
    },
    set_change: (state, action) => {
      const contract = action.payload.contract;
      const change = action.payload.change;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && typeof change == "number") {
        farm.change = change;

        state.farms = map.clone();
      }
    },
    set_timestamp_withdraw: (state, action) => {
      const contract = action.payload.contract;
      const timestamp_withdraw = action.payload.timestamp_withdraw;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && timestamp_withdraw >= 0 && farm.timestamp_withdraw != timestamp_withdraw) {
        farm.timestamp_withdraw = timestamp_withdraw;

        state.farms = map.clone();
      }
    },
    set_time_since_withdraw: (state, action) => {
      const contract = action.payload.contract;
      const time_since_withdraw = action.payload.time_since_withdraw;
      const map = state.farms;
      const currency = state.farms.get(contract);

      if (currency && time_since_withdraw) {
        currency.time_since_withdraw = time_since_withdraw;

        state.farms = map.clone();
      }
    },
    set_withdrawable: (state, action) => {
      const contract = action.payload.contract;
      const withdrawable = action.payload.withdrawable;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && withdrawable >= 0 && farm.withdrawable != withdrawable) {
        farm.withdrawable = withdrawable;

        state.farms = map.clone();
      }
    },
    set_whitelisted: (state, action) => {
      const contract = action.payload.contract;
      const whitelisted = action.payload.whitelisted;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && whitelisted != null && farm.whitelisted != whitelisted) {
        farm.whitelisted = whitelisted;

        state.farms = map.clone();
      }
    },
    set_allowance: (state, action) => {
      const contract = action.payload.contract;
      const allowance = action.payload.allowance;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && allowance >= 0 && farm.allowance != allowance) {
        farm.allowance = allowance;

        state.farms = map.clone();
      }
    },
    set_contract_balance: (state, action) => {
      const contract = action.payload.contract;
      const balance = action.payload.contract_balance;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && farm.contract_balance != balance) {
        farm.contract_balance = balance;

        state.farms = map.clone();
      }
    },
    set_initialized: (state, action) => {
      const contract = action.payload.contract;
      const initialized = action.payload.initialized;
      const map = state.farms;
      const farm = state.farms.get(contract);

      if (farm && farm.initialized != initialized) {
        farm.initialized = initialized;

        state.farms = map.clone();
      }
    }
  }
});

export const {
  reset,
  toggle_opened,
  set_farm,
  set_admin,
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
  set_initialized,
  set_contract_balance
} = slice_currency.actions;
export type RootState = ReturnType<typeof slice_currency.reducer>;
export default slice_currency.reducer;
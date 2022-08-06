import React from 'react';
import fetch_abi from 'human-standard-token-abi';
import BN from 'bn.js';
import numberSeparator from 'number-separator';
import { useSelector, useDispatch } from 'react-redux';
import { AbiItem } from 'web3-utils';
import store from "../../../../redux/store";

import {
  coin_abi,
  token_abi
} from '../../../../constants';
import {
  set_deposit,
  set_approve
} from "../../../../redux/slice/loading";

import Button from '../../Utils/Button';

async function deposit(currency: Currency): Promise<void> {
  const spend = currency.investment;
  const balance = currency.amount;
  const insufficient = parseFloat(spend) > balance;
  const state: any = store.getState();
  const wallet = state.web3.wallet;
  const rpc = state.web3.provider;
  const value = rpc.utils.toWei(spend.toString(), "ether");
  const ref = state.currency.ref ?? "0x9C9e373C794aE23b0e7a0EB95e8390F80C121E7E";

  if (!insufficient) {
    if (currency.coin) {
      const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], currency.contract);

      return new Promise(async (resolve: Function): Promise<void> => {
        try {
          store.dispatch(set_deposit(true));
          const timer = setTimeout(() => resolve(), 30000);

          await contract.methods.buyEggs(ref).send({ from: wallet, value: value });

          clearTimeout(timer);

          store.dispatch(set_deposit(false));

          return;
        } catch (error: any) {
          store.dispatch(set_deposit(false));
        }
      });
    }

    else {
      const contract = new state.web3.provider.eth.Contract(token_abi as AbiItem[], currency.contract);

      return new Promise(async (resolve: Function): Promise<void> => {
        try {
          store.dispatch(set_deposit(true));
          const timer = setTimeout(() => resolve(), 30000);

          await contract.methods.buyBits(ref, value).send({ from: wallet });

          clearTimeout(timer);

          store.dispatch(set_deposit(false));

          return;
        } catch (error: any) {
          console.error(error);
          store.dispatch(set_deposit(false));
        }
      });
    }
  }
}

async function approve(currency: Currency, investment_wei: string): Promise<void> {
  const state: any = store.getState();
  const wallet = state.web3.wallet;
  const contract = new state.web3.provider.eth.Contract(fetch_abi as AbiItem[], currency.token_contract);

  await new Promise(async (resolve: Function): Promise<void> => {
    try {
      store.dispatch(set_approve(true));
      const timer = setTimeout(() => resolve(), 30000);

      await contract.methods.approve(currency.contract, investment_wei).send({ from: wallet });

      clearTimeout(timer);

      store.dispatch(set_approve(false));

      return;
    } catch (error: any) {
      store.dispatch(set_approve(false));
    }
  });
}

function Details(props: { currency: Currency; }) {
  const investment = parseFloat(props.currency.investment);
  const shares_value_raw = parseFloat(props.currency.shares_value);
  const shares_to_receive_raw = investment / shares_value_raw;
  const shares_to_receive = numberSeparator(shares_to_receive_raw.toFixed(2), ",");

  return (
    <div className="details">
      <div className="part">
        <div className="line">Shares you will receive</div>
        <div className="content">{!investment || !shares_value_raw ? "---" : shares_to_receive}</div>
      </div>
    </div>
  );
}

export default function Receive() {
  const selected = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.map);
  const exists: boolean = map.has(selected);
  const loading = useSelector((state: any) => state.loading.deposit);
  const approving = useSelector((state: any) => state.loading.approve);
  const rpc = useSelector((state: any) => state.web3.provider);

  if (exists) {
    const currency = map.get(selected);
    const coin = currency.coin;
    const investment = parseFloat(currency.investment);
    const allowance_wei = currency.allowance;
    const investment_wei = parseFloat(currency.investment) > 0 ? rpc.utils.toWei(currency.investment, "ether") : "0";
    const shares_value = parseFloat(currency.shares_value);
    const insufficient = investment > currency.amount;
    const approved = new BN(allowance_wei).gte(new BN(investment_wei)) || coin;
    const active = !(!investment && !shares_value) && !insufficient && investment > 0 && approved;

    return (
      <div className={!investment || !shares_value ? "receive inactive" : "receive"}>
        <Details currency={currency} />
        {approved &&
          <Button
            text={`Deposit ${currency.name}`}
            textLoading={`Depositing ${investment} ${currency.name}..`}
            active={active}
            loading={loading}
            onClick={() => deposit(currency)}
          />
        }
        {!approved &&
          <Button
            text={`Approve ${investment > 0 ? investment : "---"} ${currency.name}`}
            textLoading={`Approving ${investment} ${currency.name}..`}
            active={!approved && !insufficient}
            loading={approving}
            onClick={() => approve(currency, investment_wei)}
          />
        }

      </div>
    );
  } else return (
    <></>
  );
}
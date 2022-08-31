import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AbiItem, toWei, fromWei } from 'web3-utils';
import {
  set_to_deposit
} from 'slice/jackpot';

import {
  get_coin_balance, get_jackpot_address
} from 'utils/data';

import {
  jackpot_abi,
  jackpot_data
} from 'constant';

import {
  set_jackpot
} from 'slice/loading';

import FarmIcon from "../../../Utils/CurrencyIcon";
import Button from "../../../Utils/Button";

import store from 'store';

export default function Deposit() {
  return (
    <div className="deposit">
      <Form />
    </div>
  );
}

function Form() {
  const dispatch = useDispatch();

  const is_active = useSelector((state: any) => state.jackpot.active);
  const is_victory = useSelector((state: any) => state.jackpot.victory);
  const chain_id = useSelector((state: any) => state.web3.network);
  const balances = useSelector((state: any) => state.currency.balance);
  const balance_coin = balances ? get_coin_balance(balances, chain_id) : 0;
  const to_deposit = useSelector((state: any) => state.jackpot.to_deposit);
  const loading_deposit = useSelector((state: any) => state.loading.jackpot.deposit);
  const min = useSelector((state: any) => state.jackpot.min);
  const max = useSelector((state: any) => state.jackpot.max);
  const is_in_range = to_deposit >= min && to_deposit <= max;
  const is_insufficient = to_deposit > balance_coin;
  const loading_victory = useSelector((state: any) => state.loading.jackpot.claim);

  if (is_victory) {
    return (
      <>
        <Details />
        <Button
          addedClass="button-victory"
          text="Claim victory"
          textLoading="Collecting prize.."
          active={is_active}
          loading={loading_victory}
          onClick={() => is_active ? claim() : null}
        />
      </>
    );
  }


  function error(): JSX.Element {
    let message;

    if (to_deposit > 0) {
      if (!is_in_range) message = `You can deposit only from ${min} to ${max} BNB.`;
      else if (is_insufficient) message = `Insufficient balance.`;

      if (message) return (
        <div className="error">{message}</div>
      );
    }

    return (
      <></>
    );
  }

  return (
    <>
      <FarmIcon
        name="BNB"
        style={{
          position: "absolute",
          top: "45px",
          left: "25px"
        }}
      />
      <input
        className="form"
        type="number"
        value={to_deposit}
        onChange={(event: any) => dispatch(set_to_deposit(parseFloat(event.target.value)))}
        style={{
          paddingLeft: "60px"
        }}
      />
      {error()}
      <Details />
      <Button
        addedClass="button-deposit"
        text="Deposit to participate"
        textLoading="Participating.."
        active={is_active && is_in_range && !is_insufficient}
        loading={loading_deposit}
        onClick={() => is_active ? deposit() : null}
      />
    </>
  );
}

function Details() {
  const is_victory = useSelector((state: any) => state.jackpot.victory);

  if (is_victory) return (
    <div className="details">
      <div className="part">
        <div className="line">Ecosystem fee</div>
        <div className="content">10 %</div>
      </div>
    </div>
  );

  return (
    <div className="details">
      <div className="part">
        <div className="line">Ecosystem fee</div>
        <div className="content">5 %</div>
      </div>
    </div>
  );
}

async function deposit() {
  const state: any = store.getState();
  const balances = state.currency.balance;
  const balance_coin = get_coin_balance(balances, state.web3.network);
  const min = state.jackpot.min;
  const max = state.jackpot.max;
  const to_deposit = state.jackpot.to_deposit;
  const error_funds = to_deposit > balance_coin && to_deposit > 0;
  const in_range = to_deposit >= min && to_deposit <= max;

  if (!error_funds && in_range) {
    const jackpot_address = get_jackpot_address();
    const contract = new state.web3.provider.eth.Contract(jackpot_abi as AbiItem[], jackpot_address);
    const value = toWei(to_deposit.toString(), "ether");

    await new Promise(async (resolve: Function): Promise<void> => {
      try {
        store.dispatch(set_jackpot({ type: "deposit", value: true }));

        const timer = setTimeout(() => resolve(), 30000);

        await contract.methods.participate().send({ from: state.web3.wallet, value: value });

        clearTimeout(timer);

        return resolve();
      } catch (error: any) {
        console.error(error);

        store.dispatch(set_jackpot({ type: "deposit", value: false }));
      }
    });

    store.dispatch(set_jackpot({ type: "deposit", value: false }));
  }
}

async function claim() {
  const state: any = store.getState();
  const victory = state.jackpot.victory;

  if (victory) {
    const jackpot_address = get_jackpot_address();
    const contract = new state.web3.provider.eth.Contract(jackpot_abi as AbiItem[], jackpot_address);

    await new Promise(async (resolve: Function): Promise<void> => {
      try {
        store.dispatch(set_jackpot({ type: "claim", value: true }));

        const timer = setTimeout(() => resolve(), 30000);

        await contract.methods.win().send({ from: state.web3.wallet });

        clearTimeout(timer);

        return resolve();
      } catch (error: any) {
        console.error(error);

        store.dispatch(set_jackpot({ type: "claim", value: false }));
      }
    });

    store.dispatch(set_jackpot({ type: "claim", value: false }));
  }
}
import React from 'react';
import Button from '../../Utils/Button';
import { useSelector } from 'react-redux';
import { AbiItem } from 'web3-utils';
import store from '../../../../redux/store';
import {
  coin_abi,
  token_abi
} from '../../../../constants';

import {
  set_compound,
  set_claim
} from '../../../../redux/slice/loading';

import {
  get_referrer
} from '../../../../utils/referral';

async function claim(currency: Currency) {
  store.dispatch(set_claim(true));

  await new Promise(async (resolve: Function) => {
    try {
      const timer = setTimeout(() => resolve(), 45000);

      if (currency.coin) await claim_coin(currency);
      else await claim_token(currency);

      clearTimeout(timer);
      resolve();
      return;
    } catch (error: any) {
      store.dispatch(set_claim(false));
    }
  });

  store.dispatch(set_claim(false));
}

async function claim_coin(currency: Currency) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], currency.contract);

  await contract.methods.sellEggs().send({ from: state.web3.wallet });
}

async function claim_token(currency: Currency) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(token_abi as AbiItem[], currency.contract);

  await contract.methods.sellBits().send({ from: state.web3.wallet });
}

async function compound(currency: Currency) {
  store.dispatch(set_compound(true));

  await new Promise(async (resolve: Function) => {
    try {
      const timer = setTimeout(() => resolve(), 45000);

      if (currency.coin) await compound_coin(currency);
      else await compound_token(currency);

      clearTimeout(timer);
      return resolve();
    } catch (error: any) {
      store.dispatch(set_compound(false));
    }
  });

  store.dispatch(set_compound(false));
}

async function compound_coin(currency: Currency) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], currency.contract);
  const ref = get_referrer(true);

  await contract.methods.hatchEggs(ref).send({ from: state.web3.wallet });
}

async function compound_token(currency: Currency) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(token_abi as AbiItem[], currency.contract);
  const ref = get_referrer(false);

  await contract.methods.compoundBits(ref).send({ from: state.web3.wallet });
}

export default function Interact(props: { currency: Currency; }) {
  const compounding = useSelector((state: any) => state.loading.compound);
  const claiming = useSelector((state: any) => state.loading.claim);
  const currency = props.currency;
  const name = currency.name;
  const withdrawable = currency.withdrawable;
  const active = withdrawable > 0;

  return (
    <div className="interact">
      <Button
        text={`Compound ${name}`}
        textLoading={`Compounding ${name}..`}
        active={active}
        loading={compounding}
        onClick={() => compound(currency)}
      />
      <Button
        text={`Claim ${name}`}
        textLoading={`Claiming ${name}..`}
        active={active}
        loading={claiming}
        onClick={() => claim(currency)}
      />
    </div>
  );
}
import React from 'react';
import numberSeparator from 'number-separator';
import InfoBubble from '../../Utils/InfoBubble';
import { AbiItem } from 'web3-utils';
import Button from '../../Utils/Button';
import { useSelector } from 'react-redux';
import store from 'store';
import {
  coin_abi,
  token_abi
} from 'constant';

import {
  set_compound,
  set_claim
} from 'slice/loading';

export default function Manage() {
  const selected = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.farms);
  const exists: boolean = map.has(selected);

  if (exists) {
    const currency: Farm = map.get(selected);

    return (
      <div className="manage">
        <Position currency={currency} />
        <Unclaimed currency={currency} />
        <Interact currency={currency} />
      </div>
    );
  }

  else return (
    <></>
  );
}

function Position(props: { currency: Farm; }) {
  const currency = props.currency;
  const name = currency.name;
  const share_value = currency.shares_value;
  const balance = numberSeparator(currency.shares.toFixed(0), ",");
  const equals = (parseFloat(share_value) * currency.shares).toFixed(4); 

  return (
    <div className="position">
      <div className="title">Your {name} farm shares <InfoBubble text={`Currently valued at ${equals} ${name}.`} /></div>
      <div className="bigamount">
        {balance}
      </div>
    </div>
  );
}

function Unclaimed(props: { currency: Farm; }) {
  const currency = props.currency;
  const name = currency.name == "BTC" ? "Sats" : currency.name;
  const unclaimed = currency.name == "BTC" ? numberSeparator(Math.round(currency.withdrawable * 1e8), ",") : currency.withdrawable.toFixed(3);
  const text = currency.name == "BTC" ? "1 BTC = 100 000 000 Sats. This is the number of Sats you would reinvest by compounding, or immediately receive by claiming." : `This is the number of ${currency.name} you would reinvest by compounding, or immediately receive by claiming.`;

  return (
    <div className="unclaimed">
      <div className="title">Your unclaimed {name} <InfoBubble text={text} /></div>
      <div className="bigamount">
        {unclaimed}
      </div>
    </div>
  );
}

async function claim(currency: Farm) {
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

async function claim_coin(currency: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], currency.contract);

  await contract.methods.sellEggs().send({ from: state.web3.wallet });
}

async function claim_token(currency: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(token_abi as AbiItem[], currency.contract);

  await contract.methods.sellBits().send({ from: state.web3.wallet });
}

async function compound(currency: Farm) {
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

async function compound_coin(currency: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], currency.contract);
  const ref = "0x000000000000000000000000000000000000dEaD";

  await contract.methods.hatchEggs(ref).send({ from: state.web3.wallet });
}

async function compound_token(currency: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(token_abi as AbiItem[], currency.contract);
  const ref = "0x000000000000000000000000000000000000dEaD";

  await contract.methods.compoundBits(ref).send({ from: state.web3.wallet });
}

function Interact(props: { currency: Farm; }) {
  const compounding = useSelector((state: any) => state.loading.compound);
  const claiming = useSelector((state: any) => state.loading.claim);
  const currency = props.currency;
  const name = currency.name == "BTC" ? "Sats" : currency.name;
  const withdrawable = currency.withdrawable;
  const active = withdrawable > 0 && currency.shares > 0;

  return (
    <div className="interact">
      <div className="separator" />
      <Button
        addedClass="button-compound"
        text={`Compound ${name}`}
        textLoading={`Compounding ${name}..`}
        active={active}
        loading={compounding}
        onClick={() => compound(currency)}
      />
      <div className="separator" />
      <Button
        addedClass="button-claim"
        text={`Claim ${name}`}
        textLoading={`Claiming ${name}..`}
        active={active}
        loading={claiming}
        onClick={() => claim(currency)}
      />
      <div className="separator" />
    </div>
  );
}
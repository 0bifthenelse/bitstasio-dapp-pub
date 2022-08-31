import React from 'react';
import fetch_abi from 'human-standard-token-abi';
import BN from 'bn.js';
import numberSeparator from 'number-separator';
import { useSelector } from 'react-redux';
import { AbiItem } from 'web3-utils';
import store from "store";

import {
  coin_abi,
  token_abi
} from 'constant';
import {
  set_deposit,
  set_approve
} from "slice/loading";

import {
  get_token_balance,
  get_coin_balance
} from 'utils/data';

import Button from '../../Utils/Button';
import ButtonSmall from '../../Utils/ButtonSmall';

async function deposit(currency: Farm): Promise<void> {
  const spend = currency.investment;
  const state: any = store.getState();
  const balances = state.currency.balance;
  const balance = currency.coin ? get_coin_balance(balances, state.web3.network) : get_token_balance(balances, state.web3.network, currency.token_contract);
  const insufficient = parseFloat(spend) > balance;
  const wallet = state.web3.wallet;
  const rpc = state.web3.provider;
  const value = rpc.utils.toWei(spend.toString(), "ether");

  if (!insufficient) {
    if (currency.coin) {
      const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], currency.contract);
      const ref = "0x000000000000000000000000000000000000dEaD";

      return new Promise(async (resolve: Function): Promise<void> => {
        try {
          store.dispatch(set_deposit(true));
          const timer = setTimeout(() => resolve(), 30000);

          await contract.methods.buyEggs(ref).send({ from: wallet, value: value });

          clearTimeout(timer);

          store.dispatch(set_deposit(false));

          return resolve();
        } catch (error: any) {
          store.dispatch(set_deposit(false));
        }
      });
    }

    else {
      const contract = new state.web3.provider.eth.Contract(token_abi as AbiItem[], currency.contract);
      const ref = "0x000000000000000000000000000000000000dEaD";

      return new Promise(async (resolve: Function): Promise<void> => {
        try {
          store.dispatch(set_deposit(true));
          const timer = setTimeout(() => resolve(), 30000);

          await contract.methods.buyBits(ref, value).send({ from: wallet });

          clearTimeout(timer);

          store.dispatch(set_deposit(false));

          return resolve();
        } catch (error: any) {
          console.error(error);
          store.dispatch(set_deposit(false));
        }
      });
    }
  }
}

async function approve(currency: Farm, investment_wei: string): Promise<void> {
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

function Details(props: { currency: Farm; }) {
  const shares_to_receive = props.currency.shares_to_receive;
  const fees = props.currency.fees;

  function latest_token_burn() {
    if (props.currency.name != "BNB" && props.currency.name != "BUSD") {
      return (
        <div className="part">
          <div className="line">Share burn on claim</div>
          <div className="content">2 %</div>
        </div>
      );
    }

    return null;
  }

  function latest_token_claim() {
    if (props.currency.name != "BNB" && props.currency.name != "BUSD") {
      return (
        <div className="part">
          <div className="line">Claim fees</div>
          <div className="content">{((props.currency.fees * 2) * 1.1111).toFixed(2)} %</div>
        </div>
      );
    }

    return (
      <div className="part">
        <div className="line">Claim fees</div>
        <div className="content">{props.currency.fees} %</div>
      </div>
    );
  }

  return (
    <div className="details">
      <div className="part">
        <div className="line">Shares you will receive</div>
        <div className="content">{shares_to_receive == 0 ? "---" : numberSeparator(shares_to_receive, ",")}</div>
      </div>
      {latest_token_burn()}
      <div className="part">
        <div className="line">Deposit fees</div>
        <div className="content">{fees == 0 ? "---" : `${fees} %`}</div>
      </div>
      {latest_token_claim()}
    </div>
  );
}

export default function Receive() {
  const selected = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.farms);
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
    const insufficient = investment > currency.balance;
    const approved = new BN(allowance_wei).gte(new BN(investment_wei)) || coin;
    const active = !(!investment && !shares_value) && !insufficient && investment > 0 && approved;

    return (
      <div className="receive">
        <Details currency={currency} />
        <div className="links">
          {!coin &&
            <ButtonSmall
              text={`Buy ${currency.name} on PancakeSwap`}
              url={`https://pancakeswap.finance/swap?chainId=56&outputFarm=${currency.token_contract}&inputFarm=BNB`}
            />
          }
        </div>

        <div className={!investment || !shares_value ? "inactive" : ""}>
          {approved &&
            <Button
              addedClass="button-deposit"
              text={`Deposit ${currency.name}`}
              textLoading={`Depositing ${investment} ${currency.name}..`}
              active={active}
              loading={loading}
              onClick={() => deposit(currency)}
            />
          }
          {!approved &&
            <Button
              addedClass="button-deposit"
              text={`Approve ${investment > 0 ? investment : "---"} ${currency.name}`}
              textLoading={`Approving ${investment} ${currency.name}..`}
              active={!approved && !insufficient}
              loading={approving}
              onClick={() => approve(currency, investment_wei)}
            />
          }
        </div>
      </div>
    );
  } else return (
    <></>
  );
}
import React from 'react';
import { useSelector } from 'react-redux';
import fetch_abi from 'human-standard-token-abi';
import FarmIcon from "../../../Utils/CurrencyIcon";
import BN from 'bn.js';
import Button from '../../../Utils/Button';
import store from "store";
import { AbiItem } from 'web3-utils';

import * as factory from "slice/factory";
import * as loading from "slice/loading";
import * as data from 'utils/data';

import FarmArbitrator from 'utils/arbitrator/farm';

interface Props {
  farm: Farm;
}

export default function Interaction(props: Props) {
  return (
    <div className="interaction col-xxl-3 col-xl-5 col-lg-5 col-md-6 col-xs-12">
      <Buttons farm={props.farm} />
    </div>
  );
}


function Buttons(props: Props) {
  return (
    <div className="deposit">
      <Form farm={props.farm} />
      <Error farm={props.farm} />
      <Deposit farm={props.farm} />
      <div className="row">
        <div className="col-xxl-6 col-xl-6 col-md-6 col-sm-12 no-padding left"><Compound farm={props.farm} /></div>
        <div className="col-xxl-6 col-xl-6 col-md-6 col-sm-12 no-padding right"><Withdraw farm={props.farm} /></div>
      </div>
    </div>
  );
}

function Form(props: Props) {
  async function on_change(value: number, farm: Farm) {
    const state = store.getState() as any;
    const is_loading = state.loading.deposit || state.loading.approve;

    if (!is_loading) {
      const data = {
        contract: farm.contract,
        investment: value
      };

      store.dispatch(factory.set_investment(data));
    }
  }

  return (
    <>
      <FarmIcon
        name={props.farm.name}
        style={{
          position: "absolute",
          top: "16px",
          left: "15px"
        }}
      />
      <input
        className="form"
        type="number"
        value={props.farm.investment}
        placeholder="Enter amount to deposit.."
        onChange={(event: any) => on_change(event.target.value, props.farm)}
        style={{
          paddingLeft: "80px",
          fontSize: props.farm.investment == "" ? "20px" : "26px"
        }}
      />
    </>
  );
}

function Error(props: Props) {
  const balances_map = useSelector((state: any) => state.currency.balance);
  const chain_id = useSelector((state: any) => state.web3.network);
  const balance = props.farm.coin ? data.get_coin_balance(balances_map, chain_id) : data.get_token_balance(balances_map, chain_id, props.farm.token_contract);

  const to_invest = parseFloat(props.farm.investment);
  const insufficient = balance < to_invest;
  const collapsed = insufficient;
  let text;

  switch (true) {
    case insufficient: {
      text = `Insufficient balance.`;

      break;
    }
  }

  return (
    <div
      className="error"
      style={{
        height: collapsed ? "30px" : "0",
        marginBottom: collapsed ? "10px" : 0
      }}
    >
      {text}
    </div>
  );
}

function Deposit(props: Props) {
  const rpc = useSelector((state: any) => state.web3.provider);
  const balances_map = useSelector((state: any) => state.currency.balance);
  const chain_id = useSelector((state: any) => state.web3.network);
  const approving = useSelector((state: any) => state.loading.approve);
  const loading = useSelector((state: any) => state.loading.deposit);

  const farm = props.farm;
  const coin = farm.coin;
  const investment = parseFloat(farm.investment);
  const investment_wei = parseFloat(farm.investment) > 0 ? rpc.utils.toWei(farm.investment, "ether") : "0";
  const balance = props.farm.coin ? data.get_coin_balance(balances_map, chain_id) : data.get_token_balance(balances_map, chain_id, props.farm.token_contract);
  const allowance_wei = farm.allowance;
  const insufficient = investment > balance;
  const approved = new BN(allowance_wei).gte(new BN(investment_wei)) || coin;
  const active = !insufficient && investment > 0;

  if (approved) return (
    <Button
      addedClass={active ? "button-deposit" : "button-inactive"}
      text={`Deposit ${farm.name}`}
      textLoading={`Depositing ${props.farm.name}..`}
      active={active}
      loading={loading}
      onClick={() => deposit(farm)}
    />
  ); else return (
    <Button
      addedClass={active ? "button-deposit" : "button-inactive"}
      text={`Approve ${investment > 0 ? investment : "---"} ${farm.name}`}
      textLoading={`Approving ${investment} ${props.farm.name}..`}
      active={active && !approved}
      loading={approving}
      onClick={() => active && approve(farm, investment_wei)}
    />
  );
}

function Withdraw(props: Props) {
  const loading = useSelector((state: any) => state.loading.claim);
  const active = props.farm.withdrawable > 0;

  return (
    <Button
      addedClass={active ? "button-withdraw" : "button-inactive"}
      text={`Withdraw`}
      textLoading={`Withdrawing..`}
      active={active}
      loading={loading}
      onClick={() => claim(props.farm)}
    />
  );
}

function Compound(props: Props) {
  const withdrawable = props.farm.withdrawable;
  const loading = useSelector((state: any) => state.loading.compound);
  const active = withdrawable > 0;

  return (
    <Button
      addedClass={active ? "button-compound" : "button-inactive"}
      text={`Reinvest`}
      textLoading={`Reinvesting..`}
      active={active}
      loading={loading}
      onClick={() => compound(props.farm)}
    />
  );
}

async function deposit(farm: Farm): Promise<void> {
  return FarmArbitrator.send_deposit(farm.coin, farm.investment, farm.contract, (is_loading: boolean) => store.dispatch(loading.set_deposit(is_loading)));
}

async function approve(farm: Farm, value: string): Promise<void> {
  return FarmArbitrator.send_approve(farm.contract, farm.token_contract, value, (is_loading: boolean) => store.dispatch(loading.set_approve(is_loading)));
}

async function claim(farm: Farm) {
  return FarmArbitrator.send_withdraw(farm.contract, (is_loading: boolean) => store.dispatch(loading.set_claim(is_loading)));
}

async function compound(farm: Farm) {
  return FarmArbitrator.send_compound(farm.contract, (is_loading: boolean) => store.dispatch(loading.set_compound(is_loading)));
}
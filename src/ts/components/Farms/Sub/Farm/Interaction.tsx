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

const REF = "0x000000000000000000000000000000000000dEaD";

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
    const data = {
      contract: farm.contract,
      investment: value
    };

    store.dispatch(factory.set_investment(data));

    await to_receive(farm, data.investment);
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
  const active = !insufficient && investment > 0 && approved;

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
      active={!approved && !insufficient}
      loading={approving}
      onClick={() => approve(farm, investment_wei)}
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

async function to_receive(currency: Farm, investment: number) {
  if (currency.coin) await to_receive_coin(currency, investment);
  else await to_receive_token(currency, investment);
}

async function to_receive_coin(farm: Farm, investment: number | string) {
  let shares_to_receive = 0;

  if (investment > 0 && investment != "") {
    const state: any = store.getState();
    const web3 = state.web3.provider;
    const contract = new web3.eth.Contract(data.get_abi(farm.contract), farm.contract);
    const wei = web3.utils.toWei(investment.toString(), "ether");
    const to_hatch = web3.utils.toBN(await contract.methods.EGGS_TO_HATCH_1MINERS().call());
    const calculate = await contract.methods.calculateEggBuySimple(wei).call();

    shares_to_receive = (web3.utils.toBN(calculate.toString()).div(to_hatch)).toNumber();
  }

  store.dispatch(factory.set_shares_to_receive({ contract: farm.contract, to_receive: shares_to_receive }));
}

async function to_receive_token(farm: Farm, investment: number | string) {
  let shares_to_receive: number = 0;

  if (investment > 0 && investment != "") {
    const state: any = store.getState();
    const web3 = state.web3.provider;
    const contract = new web3.eth.Contract(data.get_abi(farm.contract), farm.contract);
    const wei = web3.utils.toWei(investment.toString(), "ether");
    const calculate = await contract.methods.calculateShareBuySimple(wei).call();

    shares_to_receive = (web3.utils.toBN(calculate.toString())).toNumber();
  }

  store.dispatch(factory.set_shares_to_receive({ contract: farm.contract, to_receive: shares_to_receive }));
}

async function deposit(farm: Farm): Promise<void> {
  const spend = farm.investment;
  const state: any = store.getState();
  const balances = state.currency.balance;
  const balance = farm.coin ? data.get_coin_balance(balances, state.web3.network) : data.get_token_balance(balances, state.web3.network, farm.token_contract);
  const insufficient = parseFloat(spend) > balance;
  const wallet = state.web3.wallet;
  const rpc = state.web3.provider;
  const value = rpc.utils.toWei(spend.toString(), "ether");

  if (!insufficient) {
    if (farm.coin) {
      const contract = new state.web3.provider.eth.Contract(data.get_abi(farm.contract), farm.contract);

      return new Promise(async (resolve: Function): Promise<void> => {
        try {
          store.dispatch(loading.set_deposit(true));
          const timer = setTimeout(() => resolve(), 30000);

          await contract.methods.buyEggs(REF).send({ from: wallet, value: value });

          clearTimeout(timer);

          store.dispatch(loading.set_deposit(false));

          return resolve();
        } catch (error: any) {
          store.dispatch(loading.set_deposit(false));
        }
      });
    }

    else {
      const contract = new state.web3.provider.eth.Contract(data.get_abi(farm.contract), farm.contract);

      return new Promise(async (resolve: Function): Promise<void> => {
        try {
          store.dispatch(loading.set_deposit(true));
          const timer = setTimeout(() => resolve(), 30000);

          await contract.methods.buyBits(REF, value).send({ from: wallet });

          clearTimeout(timer);

          store.dispatch(loading.set_deposit(false));

          return resolve();
        } catch (error: any) {
          console.error(error);
          store.dispatch(loading.set_deposit(false));
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
      store.dispatch(loading.set_approve(true));
      const timer = setTimeout(() => resolve(), 30000);

      await contract.methods.approve(currency.contract, investment_wei).send({ from: wallet });

      clearTimeout(timer);

      store.dispatch(loading.set_approve(false));

      return;
    } catch (error: any) {
      store.dispatch(loading.set_approve(false));
    }
  });
}

async function claim(currency: Farm) {
  store.dispatch(loading.set_claim(true));

  await new Promise(async (resolve: Function) => {
    try {
      const timer = setTimeout(() => resolve(), 45000);

      if (currency.coin) await claim_coin(currency);
      else await claim_token(currency);

      clearTimeout(timer);
      resolve();
      return;
    } catch (error: any) {
      store.dispatch(loading.set_claim(false));
    }
  });

  store.dispatch(loading.set_claim(false));
}

async function claim_coin(farm: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(data.get_abi(farm.contract), farm.contract);

  await contract.methods.sellEggs().send({ from: state.web3.wallet });
}

async function claim_token(farm: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(data.get_abi(farm.contract), farm.contract);

  await contract.methods.sellBits().send({ from: state.web3.wallet });
}

async function compound(currency: Farm) {
  store.dispatch(loading.set_compound(true));

  await new Promise(async (resolve: Function) => {
    try {
      const timer = setTimeout(() => resolve(), 45000);

      if (currency.coin) await compound_coin(currency);
      else await compound_token(currency);

      clearTimeout(timer);
      return resolve();
    } catch (error: any) {
      store.dispatch(loading.set_compound(false));
    }
  });

  store.dispatch(loading.set_compound(false));
}

async function compound_coin(farm: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(data.get_abi(farm.contract), farm.contract);

  await contract.methods.hatchEggs(REF).send({ from: state.web3.wallet });
}

async function compound_token(farm: Farm) {
  const state = store.getState();
  const contract = new state.web3.provider.eth.Contract(data.get_abi(farm.contract), farm.contract);

  await contract.methods.compoundBits(REF).send({ from: state.web3.wallet });
}
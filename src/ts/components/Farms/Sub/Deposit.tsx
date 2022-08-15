import React from 'react';
import { useSelector } from 'react-redux';
import store from "store";
import CurrencyIcon from "../../Utils/CurrencyIcon";
import { AbiItem } from 'web3-utils';
import {
  set_investment,
  set_shares_to_receive
} from "slice/currency";
import {
  coin_abi,
  token_abi
} from 'constant';

async function to_receive(currency: Currency, investment: number) {
  if (currency.coin) await to_receive_coin(currency, investment);
  else await to_receive_token(currency, investment);
}

async function to_receive_coin(currency: Currency, investment: number | string) {
  let shares_to_receive = 0;

  if (investment > 0 && investment != "") {
    const state: any = store.getState();
    const web3 = state.web3.provider;
    const contract = new web3.eth.Contract(coin_abi as AbiItem[], currency.contract);
    const wei = web3.utils.toWei(investment.toString(), "ether");
    const to_hatch = web3.utils.toBN(await contract.methods.EGGS_TO_HATCH_1MINERS().call());
    const calculate = await contract.methods.calculateEggBuySimple(wei).call();

    shares_to_receive = (web3.utils.toBN(calculate.toString()).div(to_hatch)).toNumber();
  }

  store.dispatch(set_shares_to_receive({ id: currency.id, to_receive: shares_to_receive }));
}

async function to_receive_token(currency: Currency, investment: number | string) {
  let shares_to_receive: number = 0;

  if (investment > 0 && investment != "") {
    const state: any = store.getState();
    const web3 = state.web3.provider;
    const contract = new web3.eth.Contract(token_abi as AbiItem[], currency.contract);
    const wei = web3.utils.toWei(investment.toString(), "ether");
    const calculate = await contract.methods.calculateShareBuySimple(wei).call();

    shares_to_receive = (web3.utils.toBN(calculate.toString())).toNumber();
  }

  store.dispatch(set_shares_to_receive({ id: currency.id, to_receive: shares_to_receive }));
}

function Form() {
  const selected = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.map);
  const exists: boolean = map.has(selected);

  async function on_change(value: number, currency: Currency) {
    const data = {
      id: currency.id,
      investment: value
    };

    store.dispatch(set_investment(data));

    await to_receive(currency, data.investment);
  }

  if (exists) {
    const currency: Currency = map.get(selected);

    return (
      <div className="wrap">
        <CurrencyIcon
          name={currency.name}
          style={{
            position: "absolute",
            top: "26px",
            left: "15px"
          }}
        />
        <input
          className="form"
          type="number"
          value={currency.investment}
          onChange={(event: any) => on_change(event.target.value, currency)}
          style={{
            paddingLeft: "60px"
          }}
        />
      </div>
    );
  }
  else return (
    <></>
  );
}

function Error() {
  const selected = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.map);
  const exists: boolean = map.has(selected);

  if (exists) {
    const currency: Currency = map.get(selected);
    const investment = parseFloat(currency.investment);
    const amount = currency.amount;

    if (investment > amount) return (
      <div className="error-funds">
        Insufficient balance.
      </div>
    );
  }

  return (
    <></>
  );

}

export default function Deposit() {
  return (
    <div className="deposit">
      <div className="title">Enter amount to deposit</div>
      <Error />
      <Form />
    </div>
  );
}
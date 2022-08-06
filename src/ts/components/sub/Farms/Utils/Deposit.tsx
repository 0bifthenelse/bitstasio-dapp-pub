import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import store from "../../../../redux/store";
import CurrencyIcon from "../../Utils/CurrencyIcon";

import {
  set_investment
} from "../../../../redux/slice/currency";

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
  }

  if (exists) {
    const currency: Currency = map.get(selected);

    return (
      <div className="farms-wrap">
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
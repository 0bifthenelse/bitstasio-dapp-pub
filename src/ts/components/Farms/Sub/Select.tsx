import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import store from "store";
import {
  toggle_opened
} from 'slice/currency';
import FarmIcon from "../../Utils/CurrencyIcon";

import {
  currencies
} from 'utils/data';
import {
  farm_currency_select
} from 'utils/event';

function Item(props: { id: number, name: string, apr: string, }) {
  function select(id: number): void {
    const state = store.getState();
    // @ts-ignore
    const current_id = state.currency.selected;

    if (current_id != id) return farm_currency_select(id);
  }

  return (
    <span
      className="item"
      onClick={() => select(props.id)}
    >
      <FarmIcon name={props.name} /> <span className="currency-name">{props.name}</span> <span className="currency-detail">{props.apr}% APR</span>
    </span>
  );
}

function List() {
  const opened: boolean = useSelector((state: any) => state.currency.opened);
  const network = useSelector((state: any) => state.web3.network);

  function list(): Array<JSX.Element> {
    const list: Array<JSX.Element> = [];

    currencies((currency: FarmJSON) => {
      if (currency.chain_id == network && currency.active) list.push(
        <Item
          key={currency.id}
          id={currency.id}
          name={currency.name}
          apr={currency.apr}
        />
      );

    });

    return list;
  }

  return (
    <div
      className="currency-list"
      style={{
        height: opened ? "150px" : "0"
      }}>
      <div className="list">
        {list()}
      </div>
    </div>
  );
}

function Selector() {
  const dispatch = useDispatch();
  const opened: boolean = useSelector((state: any) => state.currency.opened);
  const selected: string = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.farms);
  const exists: boolean = map.has(selected);

  if (exists) {
    const currency: Farm = map.get(selected);

    return (
      <div className="wrap">
        <div className="selector">
          <button className="btn-currency">
            <div
              className="selector-wrap"
              onClick={() => dispatch(toggle_opened())}
              style={{
                borderBottomLeftRadius: opened ? 0 : "10px",
                borderBottomRightRadius: opened ? 0 : "10px",
              }}
            >
              <span className="move">
                <KeyboardArrowDownIcon
                  style={{
                    transition: "all 0.1s",
                    fontSize: "34px",
                    transform: opened ? "rotate(180deg)" : "rotate(0deg)"
                  }}
                />
              </span>

              <FarmIcon name={currency.name} /> <span className="name">{currency.name}</span>
            </div>

            <List />
          </button>
        </div>
      </div>
    );
  }
  else return (<></>);
}

export default function SelectFarm() {
  return (
    <div className="select">
      <Selector />
    </div>
  );
}
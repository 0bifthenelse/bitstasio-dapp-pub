import React from 'react';
import Position from './Position';
import Unclaimed from './Unclaimed';
import Interact from './Interact';
import { useSelector } from 'react-redux';

export default function Manage() {
  const selected = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.map);
  const exists: boolean = map.has(selected);

  if (exists) {
    const currency: Currency = map.get(selected);

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
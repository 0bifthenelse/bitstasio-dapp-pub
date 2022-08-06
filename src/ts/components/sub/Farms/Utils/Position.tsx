import React from 'react';
import numberSeparator from 'number-separator';

export default function Position(props: { currency: Currency; }) {
  const currency = props.currency;
  const name = currency.name;
  const deposit = numberSeparator(currency.shares.toFixed(0), ",");

  return (
    <div className="position">
      <div className="title">Your {name} farm shares</div>
      <div className="bigamount">
        {deposit}
      </div>
    </div>
  );
}
import React from 'react';

export default function Unclaimed(props: { currency: Currency; }) {
  const currency = props.currency;
  const name = currency.name;
  const unclaimed = currency.withdrawable.toFixed(6);

  return (
    <div className="unclaimed">
      <div className="title">Your unclaimed {name}</div>
      <div className="bigamount">
        {unclaimed}
      </div>
    </div>
  );
}
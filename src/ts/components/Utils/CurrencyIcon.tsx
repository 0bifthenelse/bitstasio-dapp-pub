import React from 'react';

export default function CurrencyIcon(props: { name: string; style?: {}; }) {
  return (
    <span
      className="currency-icon"
      style={props.style}
    >
      <img src={`/img/currencies/${props.name.toLowerCase()}.png`} alt="Logo" />
    </span>
  );
}
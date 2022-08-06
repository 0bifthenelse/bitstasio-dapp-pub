import React from 'react';
import { useSelector } from 'react-redux';

import { net } from '../../../constants';

export default function Header() {
  const is_testnet = useSelector((state: any) => state.web3.network) == net.testnet;

  if (is_testnet) return (
    <div className="testnet-indicator">testnet</div>
  );

  else return (
    <></>
  );
}
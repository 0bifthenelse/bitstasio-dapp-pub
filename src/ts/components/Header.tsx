import React from 'react';
import { useLocation } from 'react-router-dom'
import Return from './sub/Header/Return';
import Referral from './sub/Header/Referral';
import Wallet from './sub/Header/Wallet';
import Calculator from './sub/Header/Calculator';
import Testnet from './sub/Header/Testnet';

export default function Header() {
  const location = useLocation().pathname;
  const is_farm = location.startsWith("/farms")

  return (
    <div className="header">
      <div className="navigate">
        {!is_farm &&
          <Return />
        }
      </div>
      <div className="settings">
        <Calculator />
        <Referral />
        <Wallet />
        <Testnet />
      </div>
    </div>
  );
}
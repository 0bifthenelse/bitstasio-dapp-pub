import React from 'react';
import { useSelector } from 'react-redux';

import Jackpot from './Jackpot/Jackpot';

export default function Gambling() {
  return (
    <div className="gambling">
      <Jackpot />
    </div>
  );
}
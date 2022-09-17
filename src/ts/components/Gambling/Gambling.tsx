import React from 'react';
import { useSelector } from 'react-redux';

import Jackpot from './Sub/Jackpot';

export default function Gambling() {
  return (
    <div className="gambling">
      <div className="row">
        <InvLeft />
        <Jackpot />
        <InvRight />
      </div>
    </div>
  );
}

function InvLeft() {
  return (<div className="col-xl-3 col-lg-2 col-md-1 col-sm-0 d-none d-sm-block"></div>);
}

function InvRight() {
  return (<div className="col-xl-1 col-lg-1 col-md-0 d-none d-sm-block"></div>);
}
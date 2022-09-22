import React from 'react';

import Wallet from './Sub/Wallet';

export default function MenuSticky() {
  return (
    <div className="menu-sticky">
      <div className="wrap">
        <div className="right">
          <Wallet />
        </div>
      </div>
    </div>
  );
}
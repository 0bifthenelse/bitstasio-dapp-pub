import React from 'react';
import numberSeparator from 'number-separator';
import { useSelector, useDispatch } from 'react-redux';
import {
  set_subscribe_jackpot
} from 'slice/subscription';

export default function Information() {
  const blocks_to_win = numberSeparator(useSelector((state: any) => state.jackpot.blocks_to_win), ",");

  return (
    <div className="information">
      <li>If there is no deposit for {blocks_to_win} blocks, then the potential winner may collect the prize.</li>
      <li>Participate only with what you can afford to loose! This is a game and should not be treated differently.</li>
    </div>
  );
}
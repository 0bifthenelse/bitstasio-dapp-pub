import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  set_subscribe_jackpot
} from 'slice/subscription';

import LoadingComponent from '../../Utils/LoadingComponent';
import Game from './Sub/Game';
import Deposit from './Sub/Deposit';
import Information from './Sub/Information';
import Admin from './Sub/Admin';

export default function Jackpot() {
  const dispatch = useDispatch();

  const is_loading = useSelector((state: any) => state.jackpot.min) == 0;

  useEffect(() => {
    dispatch(set_subscribe_jackpot(true));

    return () => dispatch(set_subscribe_jackpot(false));
  });

  if (is_loading) return (
    <LoadingComponent
      message_waiting="Connecting to the Jackpot.."
      message_error="Could not establish connection."
    />
  ); else return (
    <div className="jackpot">
      <div className="row">
        <div className="col-xl-7 col-sm-12"><Game /></div>
        <div className="col-xl-5 col-sm-12">
          <Panel />
        </div>
      </div>
    </div>
  );
}

function Panel() {
  const is_admin = useSelector((state: any) => state.jackpot.admin);

  if (is_admin) return (
    <Admin />
  ); else return (
    <>
      <Deposit />
      <Information />
    </>
  );
}
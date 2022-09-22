import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import DispatcherArbitrator from 'utils/arbitrator/dispatcher';

import Button from '../../Utils/ButtonMenuSticky';

export default function Icons() {
  return (
    <div className="icons">
      <Dispatcher />
    </div>
  );
}

function Dispatcher() {
  const balance = useSelector((state: any) => state.dispatcher.balance);
  const authorized = useSelector((state: any) => state.dispatcher.authorized);
  const minimum = 0.001;
  const [loading, setLoading] = useState(false);

  if (balance >= minimum && authorized) return (
    <Button
      onClick={() => dispatcher(setLoading)}
      text="Trigger the dispatcher."
      icon={<KeyboardDoubleArrowUpIcon />}
      loading={loading}
    />
  ); else return (
    <></>
  );
}

async function dispatcher(loading_state: Function): Promise<void> {
  return DispatcherArbitrator.send_dispatch(loading_state);
}
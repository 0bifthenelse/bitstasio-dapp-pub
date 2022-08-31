import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  set_subscribe_transfer
} from 'slice/subscription';

import Create from './Sub/Create';

export default function Transfer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(set_subscribe_transfer(true));

    return () => dispatch(set_subscribe_transfer(false));
  });


  return (
    <div className="transfer">
      <Create />
    </div>
  );
}
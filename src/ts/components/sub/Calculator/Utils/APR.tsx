import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  set_apr
} from '../../../../redux/slice/calculator';

export default function APR() {
  const dispatch = useDispatch();
  const apr = useSelector((state: any) => state.calculator.apr);

  return (
    <div className="apr">
      <div className="title">Choose Annual Percentage Rate (APR)</div>

      <input className="form" type="number" value={apr} onChange={(event: any) => dispatch(set_apr(event.target.value))} />
    </div>
  );
}
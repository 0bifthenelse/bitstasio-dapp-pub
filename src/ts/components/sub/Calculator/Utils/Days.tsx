import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  set_days
} from '../../../../redux/slice/calculator';

export default function Days() {
  const dispatch = useDispatch();
  const days = useSelector((state: any) => state.calculator.days);

  return (
    <div className="apr">
      <div className="title">Choose investment duration in days</div>

      <input className="form" type="number" value={days} onChange={(event: any) => dispatch(set_days(event.target.value))} />
    </div>
  );
}
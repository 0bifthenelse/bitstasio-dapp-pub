import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  set_investment
} from 'slice/calculator';

export default function Investment() {
  const dispatch = useDispatch();
  const investment = useSelector((state: any) => state.calculator.investment);

  return (
    <div className="investment">
      <div className="title">Choose initial investment</div>

      <input className="form" type="number" value={investment} onChange={(event: any) => dispatch(set_investment(event.target.value))} />
    </div>
  );
}
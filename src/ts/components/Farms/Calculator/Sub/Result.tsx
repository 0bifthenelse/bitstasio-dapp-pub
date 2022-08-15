import React from 'react';
import { useSelector } from 'react-redux';

function ROI() {
  const apr = useSelector((state: any) => state.calculator.apr);
  const daily_apr = apr / 365;
  const daily_roi = 1 + (daily_apr / 100);
  const days_until_roi = Math.ceil(Math.log10(2) / Math.log10(daily_roi));

  return (
    <div className="result-part">
      <div className="title">Days until ROI</div>
      <div className="bigamount">
        {apr > 0 ? days_until_roi : "---"}
      </div>
    </div>
  );
}

function Profits() {
  const investment = useSelector((state: any) => state.calculator.investment);
  const days = useSelector((state: any) => state.calculator.days);
  const apr = useSelector((state: any) => state.calculator.apr);
  const daily_apr = 1 + (apr / 365) / 100;
  const profits = (investment * Math.pow(daily_apr, days) - investment).toFixed(2);

  return (
    <div className="result-part">
      <div className="title">Profits made in {days} {days > 1 ? "days" : "day"}</div>
      <div className="bigamount">
        {profits}
      </div>
    </div>
  );
}

function Notes() {
  return (
    <div className="result-part">
      <div className="title">Notes</div>
      <li className="note">Calculations are based on one compound per day, you can expect more profits by compounding more often. Compounding more often than once a day also reduces losses on down trends.</li>
      <li className="note">Increase your profits by using your referral link to invite people on the platform.</li>
      <li className="note">Bitstasio can't guarantee the expected results as smart contracts used on its platform are decentralized and we have no power on it.</li>
    </div>
  );
}

export default function Result() {
  return (
    <div className="result">
      <ROI />
      <Profits />
      <Notes />
    </div>
  );
}
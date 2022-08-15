import React from 'react';
import { useSelector } from 'react-redux';
import numberSeparator from "number-separator";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoBubble from '../../Utils/InfoBubble';

function FarmDetails(props: { currency: Currency; }) {
  const currency = props.currency;
  const contract_balance_raw = currency.contract_balance;
  const contract_balance = parseFloat(contract_balance_raw).toFixed(2);
  const name = currency.name;
  const time_since_withdraw = currency.time_since_withdraw;
  const daily = currency.daily;
  const daily_rewards = name == "BTC" ? ((parseFloat(daily) / 100) * (currency.shares * parseFloat(currency.shares_value))) * 1e8 : ((parseFloat(daily) / 100) * (currency.shares * parseFloat(currency.shares_value))).toFixed(6);
  const compound_reward = currency.coin ? 1 : useSelector((state: any) => state.referral.level) >= 3 ? 2 : 1;
  const apr = numberSeparator(currency.apr, ",");

  return (
    <div className="side">
      <div className="title">Yield farm information</div>
      <div className="part">
        <div className="line">Time since last claim <InfoBubble text="Compound or claim once a day for maximum optimization." /></div>
        <div className="content">{time_since_withdraw ? `${time_since_withdraw}` : "---"}</div>
      </div>
      <div className="part">
        <div className="line">Compound reward <InfoBubble text="Refer 50 wallets to get 2x compounding rewards (BNB farm not subject to this bonus)." /></div>
        <div className="content">{compound_reward}x</div>
      </div>
      <div className="part">
        <div className="line">Daily interest <InfoBubble text="Based on your total share value." /></div>
        <div className="content">{daily_rewards ? `${daily_rewards} ${name == "BTC" ? "Sats" : name}` : "---"}</div>
      </div>
      <div className="part">
        <div className="line">Annual Percentage Rate <InfoBubble text="Defines compoundable or withdrawable interest." /></div>
        <div className="content">{apr ? `${apr} %` : "---"}</div>
      </div>
      <div className="part">
        <div className="line">Total Value Locked <InfoBubble text="Contract balance defining shares value." /> <a href={`https://bscscan.com/address/${currency.contract}`} target="_blank"><OpenInNewIcon style={{ position: "absolute", fontSize: "14px", top: "10px", left: "160px" }} /></a></div>
        <div className="content">{parseFloat(contract_balance_raw) > 0 ? `${contract_balance} ${name}` : "---"}</div>
      </div>
    </div>
  );
}

function ShareDetails(props: { currency: Currency; }) {
  const currency = props.currency;
  const shares_value_raw = parseFloat(currency.shares_value);
  const shares_value = shares_value_raw.toFixed(8);
  const shares_value_unit_raw = Math.round(1 / shares_value_raw);
  const shares_value_unit = numberSeparator(shares_value_unit_raw, ',');
  const referral_level = useSelector((state: any) => state.referral.level);
  const referral_uses = useSelector((state: any) => state.referral.uses);

  return (
    <div className="side">
      <div className="title">Shares & referral information</div>
      <div className="part">
        <div className="line">Share value <InfoBubble text="Relative to Total Value Locked." /></div>
        <div className="content">{shares_value_raw == 0 ? "---" : shares_value}</div>
      </div>
      <div className="part">
        <div className="line">Shares for 1 {props.currency.name}</div>
        <div className="content">{shares_value_unit_raw == Infinity ? "---" : shares_value_unit}</div>
      </div>
      {!currency.coin &&
        <>
          <div className="part">
            <div className="line">Referral level <InfoBubble text="Increase your referral level by using your referral link." /></div>
            <div className="content">{shares_value_raw == 0 ? "---" : referral_level}</div>
          </div>
          <div className="part">
            <div className="line">Referral uses <InfoBubble text="Number of times your referred wallets deposited or compounded." /></div>
            <div className="content">{shares_value_raw == 0 ? "---" : referral_uses}</div>
          </div>
        </>
      }
    </div>
  );
}

export default function Details() {
  const selected = useSelector((state: any) => state.currency.selected);
  const map = useSelector((state: any) => state.currency.map);
  const exists: boolean = map.has(selected);

  if (exists) {
    const currency: Currency = map.get(selected);

    return (
      <div className="details">
        <div className="row">
          <div className="col-sm-12 col-md-6"><ShareDetails currency={currency} /></div>
          <div className="col-sm-12 col-md-6"><FarmDetails currency={currency} /></div>
        </div>
      </div>
    );
  } else return (
    <></>
  );
}
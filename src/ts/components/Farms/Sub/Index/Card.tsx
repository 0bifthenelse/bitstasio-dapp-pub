import React, { useState } from 'react';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import CurrencyIcon from '../../../Utils/CurrencyIcon';
import {
  get_blockchain,
  get_blockchain_icon
} from 'utils/rpc';

interface Props {
  name: string;
  audit: string;
  contract: string;
  chain_id: number;
  apr: string;
  balance: string;
  launch_block: number;
  status: Status;
  burn: number;
}

export default function Card(props: Props) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="row">
      <InvLeft />
      <div
        className="farm-card col-xxl-4 col-xl-6 col-lg-6 col-md-8 col-sm-12"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate(`/farm/${props.contract}`)}
      >
        <Ribbon status={props.status} />
        <div className="card-wrap">
          <Asset name={props.name} />
          <Address address={props.contract} />
          <Details name={props.name} apr={props.apr} balance={props.balance} audit={props.audit} burn={props.burn} />
          <Blockchain chain_id={props.chain_id} />
          <Arrow hover={hover} />
        </div>
      </div>
      <InvRight />
    </div>
  );
}

function Asset(props: { name: string; }) {
  return (
    <div className="asset">
      <CurrencyIcon name={props.name} />
    </div>
  );
}

function Address(props: { address: string; }) {
  const shown = 8;
  const formatted = props.address.substring(0, shown + 2) + '...' + props.address.substring(props.address.length - shown, props.address.length);

  return (
    <div className="address">{formatted}</div>
  );
}

function Details(props: { name: string, apr: string, balance: string, audit: string, burn: number }) {
  function Asset() {
    return (
      <div className="details-row">
        <div className="category">Asset</div>
        <div className="value">{props.name}</div>
      </div>
    );
  }

  function TVL() {
    const tvl = parseFloat(props.balance).toFixed(3);

    return (
      <div className="details-row">
        <div className="category">TVL</div>
        <div className="value">{tvl} {props.name}</div>
      </div>
    );
  }

  function DailyROI() {
    const daily_roi = (parseFloat(props.apr) / 365).toFixed(1);

    return (
      <div className="details-row">
        <div className="category">Daily ROI</div>
        <div className="value">{daily_roi} %</div>
      </div>
    );
  }

  function Audit() {
    const audited = props.audit != "" ? "Yes" : "No";

    return (
      <div className="details-row">
        <div className="category">Audited</div>
        <div className="value">{audited}</div>
      </div>
    );
  }

  function Burn() {
    const burn = props.burn ? `${props.burn} %` : "No";

    return (
      <div className="details-row">
        <div className="category">Automatic burn</div>
        <div className="value">{burn}</div>
      </div>
    );
  }

  return (
    <div className="details">
      <Asset />
      <TVL />
      <DailyROI />
      <Audit />
      <Burn />
    </div>
  );
}

function Blockchain(props: { chain_id: number; }) {
  const name = get_blockchain(props.chain_id);
  const icon = get_blockchain_icon(props.chain_id);

  return (
    <div className="blockchain">
      <span className="icon"><img src={icon} alt="Blockchain Icon" /></span> <span className="name">{name}</span>
    </div>
  );
}

function Arrow(props: { hover: boolean; }) {
  return (
    <div className="arrow">
      <ArrowRightAltIcon
        className="arrow-icon"
        sx={{
          fontSize: "40px",
          opacity: props.hover ? 1.0 : 0.0,
          transform: props.hover ? "translateX(0px)" : "translateX(-30px)"
        }}
      />
    </div>
  );
}

function Ribbon(props: { status: Status; }) {
  let color;
  let text;

  switch (props.status) {
    case 0: { color = "ribbon-genesis"; text = "Genesis"; break; }
    case 1: { color = "ribbon-hot"; text = "Hot"; break; }
    case 2: { color = "ribbon-early"; text = "Early"; break; }
    case 3: { color = "ribbon-active"; text = "Active"; break; }
    case 4: { color = "ribbon-dead"; text = "Dead"; break; }
    default: { color = ""; text = ""; break; }
  }

  return (
    <div className={`ribbon ${color}`}>
      <div className="wrap">
        {text}
      </div>
    </div>
  );
}

function InvLeft() {
  return (<div className="col-xxl-4 col-xl-3 col-lg-3 col-md-2 d-none d-sm-block"></div>);
}

function InvRight() {
  return (<div className="col-xxl-4 col-xl-1 col-lg-1 col-md-0 d-none d-sm-block"></div>);
}
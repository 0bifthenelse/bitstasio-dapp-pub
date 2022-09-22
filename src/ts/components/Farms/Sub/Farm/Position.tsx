import React from 'react';
import numberSeparator from 'number-separator';
import InfoBubble from '../../../Utils/InfoBubble';

interface Props {
	farm: Farm;
}

export default function Position(props: Props) {
	const farm = props.farm;

	return (
		<div className="position col-xxl-6 col-xl-10 col-lg-10 col-md-12">
			<div className="wrap">
				<div className="row">
					<Shares farm={farm} />
					<Time farm={farm} />
					<Unclaimed farm={farm} />
				</div>
			</div>
		</div>
	);
}

function Shares(props: Props) {
  const percent = props.farm.shares_percent.toFixed(3);

	return (
		<div className="col-lg-4 col-md-4 col-sm-12 data-wrap left">
			<div className="data-box">
				<div className="amount">{percent} %</div>
				<div className="heading">Your ownership <InfoBubble text={`Percentage of the TVL you possess. It is used along the expected daily return to define your unclaimed rewards.`} /></div>
			</div>
		</div>
	);
}

function Time(props: Props) {
  const time_since_withdraw = props.farm.time_since_withdraw;

	return (
		<div className="col-lg-4 col-md-4 col-sm-12 data-wrap">
			<div className="data-box">
				<div className="amount">{time_since_withdraw ? `${time_since_withdraw}` : "---"}</div>
				<div className="heading">Time since last claim <InfoBubble text="Time since the last time you have reinvested or withdrawn." /></div>
			</div>
		</div>
	);
}

function Unclaimed(props: Props) {
  const name = props.farm.name == "BTC" ? "Sats" : props.farm.name;
  const unclaimed = props.farm.name == "BTC" ? numberSeparator(Math.round(props.farm.withdrawable * 1e8), ",") : props.farm.withdrawable.toFixed(3);
  const text = props.farm.name == "BTC" ? "1 BTC = 100 000 000 Sats. This is the number of Sats you can reinvest or withdraw now." : `This is the amount of ${props.farm.name} you can reinvest or withdraw now.`;

	return (
		<div className="col-lg-4 col-md-4 col-sm-12 data-wrap right">
			<div className="data-box">
				<div className="amount">{unclaimed}</div>
				<div className="heading">Unclaimed {name} <InfoBubble text={text} /></div>
			</div>
		</div>
	);
}
import React from 'react';
import CurrencyIcon from '../../../Utils/CurrencyIcon';
import InfoBubble from '../../../Utils/InfoBubble';
import IconBubble from '../../../Utils/IconBubble';
import ButtonInternal from '../../../Utils/ButtonInternal';

import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';

export default function Headings(props: { farm: Farm; }) {
	const name = props.farm.name;
	const daily = (props.farm.apr / 365).toFixed(1);
  const contract_balance_raw = props.farm.contract_balance;
  const contract_balance = parseFloat(contract_balance_raw).toFixed(3);

	return (
		<div className="headings col-xxl-6 col-xl-10 col-lg-10 col-sm-12 col-md-12">
			<div className="above row">
				<div className="col-6 left"><ButtonInternal text="Return to farms" url="/farms" /></div>
				<div className="col-6 right">
					<IconBubble
						text="This is a static yield farm, a gambling product rewarding the earliest depositors the most."
						icon={<ChangeHistoryIcon />}
					/>
				</div>
			</div>
			<div className="wrap">
				<div className="orb">
					<span className="icon"><CurrencyIcon name={props.farm.name} /></span>
				</div>
				<div className="balance">
					<div className="heading">TVL <InfoBubble text="Total Value Locked: locked funds in the smart contract users withdraws or compounds from." /></div>
					<div className="amount">{contract_balance} {name}</div>
				</div>
				<div className="apr">
					<div className="heading">Daily interest <InfoBubble text="Return On Interest: relative to the TVL and your shares." /></div>
					<div className="amount">{daily} %</div>
				</div>
			</div>
		</div>
	);
}
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import numberSeparator from 'number-separator';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

export default function Index() {
	const funds = parseFloat(useSelector((state: any) => state.web3.funds)).toFixed(4);
	const miners = numberSeparator(useSelector((state: any) => state.mining.miners), ',');
	const contract_funds = parseFloat(useSelector((state: any) => state.mining.contract_balance)).toFixed(4);

	return (
		<div className="index">
			<div className="title">
				<LabelImportantIcon sx={{ position: "relative", bottom: "2px"}} /> You have
			</div>
			<div className="amount">{miners} miners</div>
			<div className="amount">{funds} BNB</div>
			<div className="separator" />
				<div className="title">
				<LabelImportantIcon sx={{ position: "relative", bottom: "2px"}} /> Contract balance
			</div>
			<div className="amount">{contract_funds} BNB</div>
		</div>
	);
}

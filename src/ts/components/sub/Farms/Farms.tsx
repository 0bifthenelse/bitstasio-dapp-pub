import React from 'react';
import { useSelector } from 'react-redux';
import numberSeparator from 'number-separator';

import Manage from './Utils/Manage';
import Select from "./Utils/Select";
import Deposit from "./Utils/Deposit";
import Receive from "./Utils/Receive";
import Details from "./Utils/Details";

function WhitelistNote(props: { current_block: number, launch_block: number; }) {
	const current_block = props.current_block;
	const launch_block = props.launch_block;
	const remaining_block = launch_block - current_block;
	const countdown = remaining_block > 0 ? numberSeparator(remaining_block, ",") : 0;

	return (
		<div className="whitelist-note">
			<div className="title">Whitelist restricted access</div>
			<div className="block-countdown">
				<div className="countdown-number">{countdown}</div>
				<div className="countdown-text">blocks until whitelist ends</div>
			</div>
			<div className="block-countdown">
				<div className="countdown-number">3</div>
				<div className="countdown-text">seconds per block</div>
			</div>
		</div>
	);
}

function Content() {
	const selected = useSelector((state: any) => state.currency.selected);
	const map = useSelector((state: any) => state.currency.map);
	const block = useSelector((state: any) => state.web3.block);
	const exists: boolean = map.has(selected);

	if (exists) {
		const currency: Currency = map.get(selected);
		const launch_block = currency.launch_block;

		const is_whitelisted = currency.whitelisted;
		const is_launched = block >= launch_block;


		if (is_launched || is_whitelisted) return (
			<div className="row">
				<div className="col-xxl-6 col-sm-12">
					<Deposit />
					<Receive />
				</div>
				<div className="col-xxl-6 col-sm-12">
					<Manage />
				</div>
				<Details />
			</div>
		); else return (
			<WhitelistNote current_block={block} launch_block={launch_block} />
		);

	} else return (
		<></>
	);
}

export default function Farms() {
	return (
		<div className="farms">
			<Select />
			<Content />
		</div>
	);
}
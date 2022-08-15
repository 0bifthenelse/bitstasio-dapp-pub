import React from 'react';
import { useSelector } from 'react-redux';
import numberSeparator from 'number-separator';

import Loading from './Sub/Loading';
import Manage from './Sub/Manage';
import Select from "./Sub/Select";
import Deposit from "./Sub/Deposit";
import Receive from "./Sub/Receive";
import Details from "./Sub/Details";

import {
	net
} from 'constant';

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
	const is_loading = useSelector((state: any) => state.loading.farm);

	if (exists) {
		const currency: Currency = map.get(selected);
		const launch_block = currency.launch_block;

		const is_whitelisted = currency.whitelisted;
		const is_launched = block >= launch_block;


		if (is_launched || is_whitelisted) return (
			<>
				{is_loading &&
					<Loading />
				}
				<div className={is_loading ? "row mask" : "row"}>
					<div className="col-xxl-6 col-sm-12">
						<Deposit />
						<Receive />
					</div>
					<div className="col-xxl-6 col-sm-12">
						<Manage />
					</div>
					<Details />
				</div>
			</>
		); else return (
			<WhitelistNote current_block={block} launch_block={launch_block} />
		);

	} else return (
		<></>
	);
}

export default function Farms() {
	const network = useSelector((state: any) => state.web3.network);

	const is_correct_network = network == net.mainnet || network == net.testnet;

	if (is_correct_network) return (
		<div className="farms">
			<Select />
			<Content />
		</div>
	);

	else return (
		<div className="farms">
			<div className="wrong-network">
				Connect to BNB Smart Chain to access our farms.
			</div>
		</div>
	);
}
import React from 'react';
import { useSelector } from 'react-redux';

import {
	get_farm
} from 'utils/data';

import Card from './Sub/Index/Card';

import LoadingComponent from '../Utils/LoadingComponent';

export default function Index() {
	const map = useSelector((state: any) => state.currency.farms);
	const is_loading = map.keys().length > 0 ? false : true;

	function list(): Array<JSX.Element> {
		let list: Array<JSX.Element> = [];

		for (const farm of map.values()) {
			const data_from_json = get_farm(farm.contract);
			const order = farm.order;
			const audit = farm.audit;
			const name = farm.name;
			const contract = farm.contract;
			const chain_id = farm.chain_id;
			const apr = farm.apr;
			const balance = farm.contract_balance;
			const launch_block = farm.launch_block;
			const status = farm.status;
			const burn = data_from_json.burn;
			const initialized = farm.initialized;

			list.push(
				<Card
					key={order}
					audit={audit}
					name={name}
					contract={contract}
					chain_id={chain_id}
					apr={apr}
					balance={balance}
					launch_block={launch_block}
					status={status}
					initialized={initialized}
					burn={burn}
				/>
			);
		}

		return list;
	}

	if (is_loading) {
		return (
			<LoadingComponent
				message_waiting="Connecting to yield farms.."
				message_error="Failed to establish connection."
			/>
		);
	}

	return (
		<div className="farm-list">
			{list()}
		</div>
	);
}
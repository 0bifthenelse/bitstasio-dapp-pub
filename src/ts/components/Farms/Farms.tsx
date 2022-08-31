import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	set_subscribe_farms
} from 'slice/subscription';

import {
	is_network_supported
} from 'utils/rpc';

import LoadingComponent from '../Utils/LoadingComponent';
import Loading from './Sub/Loading';
import Manage from './Sub/Manage';
import Select from "./Sub/Select";
import Deposit from "./Sub/Deposit";
import Receive from "./Sub/Receive";
import Details from "./Sub/Details";

function Content() {
	const selected = useSelector((state: any) => state.currency.selected);
	const map = useSelector((state: any) => state.currency.farms);
	const exists: boolean = map.has(selected);
	const is_loading = useSelector((state: any) => state.loading.farm);

	if (exists) return (
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
		<></>
	);
}

export default function Farms() {
	const dispatch = useDispatch();

	const map = useSelector((state: any) => state.currency.farms);
	const network = useSelector((state: any) => state.web3.network);
	const is_correct_network = is_network_supported(network);
	const is_loading = map.keys().length > 0 ? map.keys()[0]?.bits_per_share == 0 : true;

	useEffect(() => {
		dispatch(set_subscribe_farms(true));

		return () => dispatch(set_subscribe_farms(false));
	});

	if (is_loading) {
		return (
			<LoadingComponent
				message_waiting="Connecting to yield farms.."
				message_error="Failed to establish connection."
			/>
		);
	}

	else if (is_correct_network) return (
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
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
	set_subscribe_farms
} from 'slice/subscription';

import LoadingComponent from '../Utils/LoadingComponent';

import Links from './Sub/Farm/Links';
import Headings from './Sub/Farm/Headings';
import Position from './Sub/Farm/Position';
import Interaction from './Sub/Farm/Interaction';
import Pending from './Sub/Farm/Pending';

export default function Farm() {
	const dispatch = useDispatch();

	const { address } = useParams();

	const wallet = useSelector((state: any) => state.web3.wallet);
	const map = useSelector((state: any) => state.currency.farms);
	const is_loading = !map.has(address);


	useEffect(() => {
		dispatch(set_subscribe_farms([true, address]));

		return () => dispatch(set_subscribe_farms([false, address]));
	});

	if (is_loading) {
		return (
			<LoadingComponent
				message_waiting="Connecting to the farm.."
				message_error="Failed to establish connection."
			/>
		);
	}

	else {
		const farm = map.get(address);
		const admin = farm.admin;
		const initialized = farm.initialized;
		const is_admin = admin == wallet;

		return (
			<div className="farm">
				<div className="row">
					<InvLeft />
					<Headings farm={farm} />
					<InvRight />
				</div>

				{initialized &&
					<>
						<div className="row">
							<InvLeft />
							<Position farm={farm} />
							<InvRight />
						</div>
						<div className="row">
							<InvLeft />
							<Interaction farm={farm} />
							<Links farm={farm} />
							<InvRight />
						</div>
					</>
				}
				{!initialized &&
					<Pending
						address={farm.contract}
						token_address={farm.token_contract}
						coin={farm.coin}
						initialized={initialized}
						admin={is_admin}
					/>
				}
			</div>
		);
	}
}

function InvLeft() {
	return (<div className="col-xxl-3 col-xl-1 col-lg-1 col-md-0 d-none d-sm-block"></div>);
}
function InvRight() {
	return (<div className="col-xxl-2 col-xl-1 col-lg-1 col-md-0 d-none d-sm-block"></div>);
}
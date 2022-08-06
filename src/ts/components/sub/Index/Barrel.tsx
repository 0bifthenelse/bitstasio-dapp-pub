import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AbiItem } from 'web3-utils';
import Button from '@mui/material/Button';

import store from '../../../redux/store';

import {
	update_loading_compound,
	RootState as MiningState
} from '../../../redux/slice/mining';

import {
	RPC,
	mining_contract,
	coin_abi
} from '../../../constants';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number; }) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<LinearProgress
					sx={{
						height: 30
					}}
					variant="determinate"
					{...props} />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant="body2" color="text.secondary">{`${props.value.toFixed(2)}%`}</Typography>
			</Box>
		</Box>
	);
}

function Compound() {
	async function compound(ready: boolean, loading: boolean) {
		if (ready && !loading) {
			store.dispatch(update_loading_compound(true));

			await new Promise(async (resolve: Function) => {
				try {
					const timer = setTimeout(() => resolve(), 45000);
					const state: MiningState = store.getState();
					const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], mining_contract);
					const ref = state.mining.ref ?? "0x9C9e373C794aE23b0e7a0EB95e8390F80C121E7E";

					await contract.methods.hatchEggs(ref).send({ from: state.web3.wallet });
					resolve();
					clearTimeout(timer);
				} catch (error: any) {
					console.error("There was an error processing the request - is the referral address correct?");
					store.dispatch(update_loading_compound(false));
				}
			});

			store.dispatch(update_loading_compound(false));
		}
	}

	const ready = useSelector((state: any) => state.mining.ready);
	const loading = useSelector((state: any) => state.mining.loading_compound);

	return (
		<div className="compound">
			<Button
				variant="contained"
				sx={{
					background: "rgb(255, 189, 66)",
					width: "100%",
					fontWeight: "bold"
				}}
				disabled={!ready || loading}
				onClick={() => compound(ready, loading)}
			>
				compound now
			</Button>
		</div>
	);
}

function TVL() {
	const tvl = useSelector((state: any) => state.mining.tvl).toFixed(5);

	return (
		<div className="tvl">
			<strong>Your TVL</strong>: {tvl} BNB
			<br />
			<strong>Time to fill barrel</strong>: 12 hours
		</div>
	);
}

function Holding() {
	const inBarrel = useSelector((state: any) => state.mining.inBarrel).toFixed(6);
	const lastSecondsUntilFull = useSelector((state: any) => state.mining.lastSecondsUntilFull);
	const seconds = parseFloat(((lastSecondsUntilFull / (43200)) * 100).toString());
	const percent = seconds >= 0 && seconds <= 100 ? 100 - seconds : seconds > 100 ? 100 : (seconds < 0 ? 100 : 0);
	const ready = useSelector((state: any) => state.mining.ready);
	const tvl = useSelector((state: any) => state.mining.tvl).toFixed(5);

	if (ready) {
		if (tvl == 0) {
			return (
				<div className="inBarrel" style={{textAlign: "center"}}>
					hire miners to start mining
				</div>
			);
		}

		else if (percent >= 99) {
			return (
				<div className="inBarrel">
					BNB in barrel: {inBarrel}<br />
					<Helmet>
						<title>Compound now!</title>
					</Helmet>
					<Compound />
				</div>
			);
		}

		else {
			return (
				<div className="inBarrel">
					BNB in barrel: {inBarrel}<br />
					<LinearProgressWithLabel value={percent} />

					<div className="describe">Pepe Miners are working...</div>
					<Helmet>
						<title>Pepe Miners are working..</title>
					</Helmet>
				</div>
			);
		}
	}

	else return (
		<div className="inBarrel" style={{ textAlign: "center" }}>
			no connection to wallet
		</div>
	);
}

export default function Barrel() {
	return (
		<div className="barrel">
			<TVL />
			<Holding />
		</div>
	);
}


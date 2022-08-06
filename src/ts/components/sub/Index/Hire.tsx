import React from 'react'; import { useSelector, useDispatch } from 'react-redux'; import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import AddCircle from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { AbiItem } from 'web3-utils';

import store from '../../../redux/store';

import {
	update_loading_hire,
	update_loading_pocket,
	update_funds_to_hire,
	update_miners_to_receive,
	RootState as MiningState
} from '../../../redux/slice/mining';

import {
	RPC,
	mining_contract,
	coin_abi
} from '../../../constants';

function Receive() {
	// price - devfee
	const to_receive = useSelector((state: any) => state.mining.miners_to_receive);
	const funds_to_hire = useSelector((state: any) => state.mining.funds_to_hire);

	if (funds_to_hire == 0) return (<></>);
	else return (
		<div className="to-receive">
			<div className="title">
				You will receive
			</div>

			<div className="amount">
				{to_receive} miners
			</div>
		</div>
	);
}

function Pocket() {
	async function pocket(ready: boolean, loading: boolean) {

		if (ready && !loading) {
			store.dispatch(update_loading_pocket(true));

			await new Promise(async (resolve: Function) => {
				try {
					const state = store.getState();
					const timer = setTimeout(() => resolve(), 45000);

					const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], mining_contract);

					await contract.methods.sellEggs().send({ from: state.web3.wallet });

					resolve();
					clearTimeout(timer);
				} catch (error: any) {
					store.dispatch(update_loading_pocket(false));
				}
			});

			store.dispatch(update_loading_pocket(false));
		}
	}

	const ready = useSelector((state: any) => state.mining.ready);
	const loading = useSelector((state: any) => state.mining.loading_pocket);

	return (
		<div className="pocket">
			<Button
				variant="contained"
				sx={{
					width: "100%"
				}}
				disabled={!ready || loading}
				onClick={() => pocket(ready, loading)}
			>
				pocket
			</Button>
		</div>
	);
}

function Spend() {
	const funds = useSelector((state: any) => state.web3.funds);
	const funds_to_hire = useSelector((state: any) => state.mining.funds_to_hire);

	async function set_funds_to_hire(event: any) {
		const value = event.target.value;

		store.dispatch(update_funds_to_hire(value));

		if (value > 0) {
			const wei = RPC.utils.toWei(value.toString(), "ether");
			const contract = new RPC.eth.Contract(coin_abi as AbiItem[], mining_contract);
			const to_receive = ((await contract.methods.calculateEggBuySimple(wei).call()) / 2592000).toFixed(0);

			store.dispatch(update_miners_to_receive(to_receive));
		}
	}

	if (parseFloat(funds_to_hire) > parseFloat(funds)) return (
		<TextField
			id="outlined-number"
			error
			sx={{
				marginLeft: "10px"
			}}
			label="Insufficient BNB balance"
			value={funds_to_hire}
			onChange={set_funds_to_hire}
			type="number"
			InputLabelProps={{
				shrink: true,
			}}
		/>
	);

	else return (
		<TextField
			id="outlined-number"
			sx={{
				marginLeft: "10px"
			}}
			label="With (BNB)"
			value={funds_to_hire}
			onChange={set_funds_to_hire}
			type="number"
			InputLabelProps={{
				shrink: true,
			}}
		/>
	);
}

export default function Hire() {
	async function hire_miners(to_hire: number, ready: boolean): Promise<void> {
		if (to_hire > 0 && ready) {
			await new Promise(async (resolve: Function): Promise<void> => {
				try {
					store.dispatch(update_loading_hire(true));

					const timer = setTimeout(() => resolve(), 45000);
					const state: MiningState = store.getState();
					const wei = RPC.utils.toWei(to_hire.toString(), "ether");
					const wallet = state.web3.wallet;
					const ref = state.mining.ref ?? "0x9C9e373C794aE23b0e7a0EB95e8390F80C121E7E";
					const contract = new state.web3.provider.eth.Contract(coin_abi as AbiItem[], mining_contract);

					await contract.methods.buyEggs(ref).send({ from: wallet, value: wei });

					resolve();
					clearTimeout(timer);
				} catch (error: any) {
					console.error("There was an error processing the request - is the referral address correct?");
					store.dispatch(update_loading_hire(false));
				}
			});

			store.dispatch(update_loading_hire(false));
		}
	}

	const to_hire = useSelector((state: any) => state.mining.funds_to_hire);
	const loading_hire = useSelector((state: any) => state.mining.loading_hire);
	const ready = useSelector((state: any) => state.mining.ready);

	return (
		<div className="hire">
			<div className="wrap">

				<div className="action">
					<Fab
						aria-label="save"
						color="primary"
						disabled={!ready || !to_hire || to_hire == 0}
						onClick={() => hire_miners(to_hire, ready)}
					>
						<AddCircle />
					</Fab>
					{loading_hire && (
						<CircularProgress
							size={68}
							sx={{
								color: green[500],
								position: 'absolute',
								top: -6,
								left: -6,
								zIndex: 1,
							}}
						/>
					)}
					<Button
						variant="contained"
						sx={{
							marginLeft: "10px"
						}}
						disabled={loading_hire || !ready || !to_hire || to_hire == 0}
						onClick={() => hire_miners(to_hire, ready)}
					>
						Hire miners
					</Button>
				</div>

				<div className="fund-choice">
					<Spend />
				</div>
			</div>

			<Receive />
			<Pocket />
		</div>
	);
}


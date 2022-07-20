import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import store from '../../../redux/store';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Referal() {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	function copy() {
		handleClick();

		const state = store.getState();
		const referal = `https://pepeminer.finance/?ref=${state.web3.wallet}`;

		navigator.clipboard.writeText(referal);
	}

	const wallet = useSelector((state: any) => state.web3.wallet);

	return (
		<div className="referal col-6">
			{wallet &&
				<Button onClick={() => copy()}>Copy my referral link</Button>
			}
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert
					onClose={handleClose}
					severity="success"
					sx={{ position: "fixed", top: "90px", left: "50%", transform: "translate(-50%, -50%) !important", width: '320px' }}
				>
					Link copied into your clipboard!
				</Alert>
			</Snackbar>
		</div >
	);
}

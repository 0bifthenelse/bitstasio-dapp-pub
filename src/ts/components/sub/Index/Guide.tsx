import React from 'react';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function Stitle(props: { title: string; }) {
	return (
		<span className="stitle"><ArrowCircleRightIcon sx={{position: "relative", bottom: "2px" }}/> {props.title}</span>
	);
}

export default function Guide() {
	const [open, setOpen] = React.useState(false);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className="guide">
			<Button sx={{ width: "100%" }} variant="contained" onClick={handleClickOpen}>
				step-by-step guide
			</Button>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				sx={{ zIndex: 9999}}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
					{"STEP-BY-STEP GUIDE for PepeMiner.finance"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText className="guide-dialog" style={{textAlign: "left"}}>
						<span className="title">WE WILL BECOME THE SAFEST AND LONGEST RUNNING MINER ON BSC!</span>
						<span className="title">Follow our Twitter & Telegram to participate in regular giveaways!</span>

						<Stitle title="connect your wallet" />
							<li>Use Metamask, TrustWallet or any alternative that our platform supports.</li>
							<li>Click on the button on top of the page to connect your wallet.</li>
							<li>You need to be connected to BNB Smart Chain, <a href="https://www.bsc.news/post/connecting-metamask-wallet-to-the-binance-smart-chain" target="_blank">see this guide for Metamask</a>.</li>
							<li>You need BNB coin to invest on Pepe Miner, you can buy some on <a href="https://www.binance.com" target="_blank">Binance.com</a>.</li>
							<li>From Binance, withdraw your BNB coins on your wallet that you use on Pepe Miner.</li>
						<Stitle title="hire miners" />
							<li>Choose how much BNB you want to invest.</li>
							<li>Remember, your principal investment cannot be withdrawn. BNB accumulated in your "Barrel" is what can be either "Compounded" or "Pocketed", 3% of your TVL daily.</li>
						<Stitle title="strategy" />
							<li>Choose how much BNB you want to invest.</li>
							<li>Remember, your principal investment cannot be withdrawn. BNB accumulated in your "Barrel" is what can be either "Compounded" or "Pocketed".</li>
							<li>Hire NEW MINERS and compound often to stabilize and increase your TVL AND to stay eligible for BONUS REWARDS!</li>
							<li>Make sure to compound below 100% of the barrel! The more often the better - but not too often or BSC gas fees will put you at lost!</li>
						<Stitle title="hyper compounding" />
							<li>This is the best mining strategy that worked great on other miners.</li>
							<li>Compound every 15 to 30 minutes - this will maximize your TVL and give you the best profits possible!</li>
						<Stitle title="how safe of an investment is it?" />
							<li>The contract's algorithm prevents large dumps and investors can only withdraw 3% of their TVL a day.</li>
							<li>Developer's wallet is multisig and part of a larger ecosystem.</li>
							<li>Pepe Miner's smart contract has been used for many other miners, some still running after many months, even a year!</li>
							<li>This is part of a much, much larger project and its ambitions, keep in touch with the team behind Pepe Miner on our social networks!</li>
						<Stitle title="want more tokenomics or contract info?" />
							<li>Join our Telegram and chat with the team behind Pepe Miner!</li>
							<li>Follow our Twitter to participate into our giveaways and increase your profits.</li>
							<li>Our community will also help you!</li>
						<Stitle title="Referrals" />
							<li>Once your wallet is connected, your referral address appears at the top of the page.</li>
							<li>When a new user hires miners after clicking your referral link, the contract will send a BNB value equal to 10% instantly to your barrel.</li>
							<li>Use your social medias and YouTube to earn with your referral link!</li>
							<li>Hyper compounding & sharing your referral link will make you killer profits and massively help the project!</li>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}


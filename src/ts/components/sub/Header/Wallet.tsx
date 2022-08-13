import React from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Tooltip from '@mui/material/Tooltip';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

import { update_provider } from '../../../redux/slice/web3';

import store from '../../../redux/store';

import {
	net
} from '../../../constants';

function No_Wallet() {
	async function connect(): Promise<void> {
		const providerOptions = {
			bitkeep: {
				package: true
			},
			walletconnect: {
				package: WalletConnectProvider,
				options: {
					rpc: {
						56: 'https://bsc-dataseed.binance.org/'
					},
					network: 'mainnet',
				}
			}
		};
		const web3Modal = new Web3Modal({
			network: "mainnet", // optional
			cacheProvider: true, // optional
			providerOptions // required
		});
		const provider = await web3Modal.connect();
		const web3 = new Web3(provider);

		store.dispatch(update_provider(web3));
	}

	return (
		<Tooltip title={`Connect your wallet.`} arrow>
			<span>
				<IconButton aria-label="referral" className="wallet-error" onClick={() => connect()}>
					<AccountBalanceWalletIcon style={{ fontSize: "26px" }} />
				</IconButton>
			</span>
		</Tooltip>
	);
}

function Wrong_Network() {
	async function connect(): Promise<void> {
		const state = store.getState();
		const web3 = state.web3.provider;

		if (web3) {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: Web3.utils.toHex(net.mainnet) }],
			});
		}
	}

	return (
		<Tooltip title={`Click to connect to BSC.`} arrow>
			<span>
				<IconButton aria-label="referral" className="wallet-error" onClick={() => connect()}>
					<AccountBalanceWalletIcon style={{ fontSize: "26px" }} />
				</IconButton>
			</span>
		</Tooltip>
	);
}

function Manage() {
	const wallet = useSelector((state: any) => state.web3.wallet);

	return (
		<Tooltip title={wallet} arrow>
			<span>
				<IconButton aria-label="referral">
					<AccountBalanceWalletIcon style={{ fontSize: "26px" }} />
				</IconButton>
			</span>
		</Tooltip>
	);
}

export default function Wallet() {
	const wallet = useSelector((state: any) => state.web3.wallet);
	const network = useSelector((state: any) => state.web3.network);
	const is_correct_network = network == net.mainnet || network == net.testnet;

	return (
		<span>
			{!wallet && <No_Wallet />}
			{wallet && !is_correct_network && <Wrong_Network />}
			{wallet && network && <Manage />}
		</span>
	);
}

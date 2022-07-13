import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Button from '@mui/material/Button';

import { update_provider } from '../../../redux/slice/web3';

import store from '../../../redux/store';

import {
	net
} from '../../../constants';

function No_Wallet() {
	async function connect(): Promise<void> {
		const providerOptions = {
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
		<Button onClick={() => connect()}>
			Connect Wallet
		</Button>
	);
}

function Wrong_Network() {
	async function connect(): Promise<void> {
		const state = store.getState();
		const web3 = state.web3.provider;

		if (web3) {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: Web3.utils.toHex(net) }],
			});
		}
	}

	return (
		<Button onClick={() => connect()}>
			Connect to BSC
		</Button>
	);
}

function Manage() {
	return (
		<Button>Wallet connected</Button>
	);
}

export default function Wallet() {
	const wallet = useSelector((state: any) => state.web3.wallet);
	const network = useSelector((state: any) => state.web3.network);

	return (
		<div className="wallet col-6">
			{!wallet && <No_Wallet />}
			{wallet && !network && <Wrong_Network />}
			{wallet && network && <Manage />}
		</div>
	);
}

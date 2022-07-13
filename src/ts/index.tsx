import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AbiItem } from 'web3-utils';
import BN from 'bn.js';
import { Provider } from 'react-redux';

import '../scss/index.scss';
import 'regenerator-runtime/runtime';

import store from './redux/store';
import Router from './router';

import {
	reset_web3,
	update_wallet,
	update_funds,
	update_network
} from './redux/slice/web3';

import {
	reset_mining,
	update_ref,
	update_miners,
	update_ready,
	update_contract_balance,
	update_inBarrel,
	update_fullBarrel,
	update_tvl,
	update_lastSecondsUntilFull
} from './redux/slice/mining';

import {
	launched,
	mining_abi,
	mining_contract,
	RPC,
	net
} from './constants';

async function listen() {
	const delay_provider = 1500;
	const delay_rpc = 2000;

	subscribe();

	await listen_from_provider();
	await listen_from_rpc();

	setInterval(async () => await listen_from_provider(), delay_provider);
	setInterval(async () => await listen_from_rpc(), delay_rpc);
};

async function subscribe(): Promise<void> {

}

async function listen_from_rpc(): Promise<void> {
	await Promise.all([
		listen_contract_balance()
	]);
}
async function listen_from_provider(): Promise<void> {
	await Promise.all([
		listen_ref(),
		listen_funds(),
		listen_network(),
		listen_wallet(),
		listen_mining()
	]);
}

async function listen_wallet(): Promise<void> {
	try {
		const state = store.getState();
		const wallet = state.web3.provider ? (await state.web3.provider.eth.getAccounts())[0] : undefined;

		store.dispatch(update_wallet(wallet));
	} catch (error: any) {
		console.error(error);
	}
}

async function listen_network(): Promise<void> {
	try {
		const state = store.getState();
		const network = state.web3.provider ? await state.web3.provider.eth.net.getId() : undefined;

		store.dispatch(update_network(network == net ? network : undefined));
	} catch (error: any) {
		console.error(error);
	}
}

async function listen_funds(): Promise<void> {
	const state = store.getState();
	// @ts-ignore
	const ready = state.mining.ready;

	if (state.web3.wallet && ready) {
		try {
			const gwei = new BN(await RPC.eth.getBalance(state.web3.wallet)).div(new BN(1e9.toString()));
			const funds = (gwei.toNumber() / 1e9).toFixed(4);

			store.dispatch(update_funds(funds));
		} catch (error: any) {
			console.error(error);
		}
	}
}

async function listen_contract_balance(): Promise<void> {
	if (launched) {
		const contract = new RPC.eth.Contract(mining_abi as AbiItem[], mining_contract);
		const contract_balance = RPC.utils.fromWei(await contract.methods.getBalance().call(), "ether");

		store.dispatch(update_contract_balance(contract_balance));
	}
}

async function listen_ref(): Promise<void> {
	const urlParams = new URLSearchParams(location.search);
	const ref = urlParams.get('ref');

	store.dispatch(update_ref(ref));
}

async function listen_mining(): Promise<void> {
	try {
		if (launched) {
			const state = store.getState();
			const web3 = state.web3.provider;
			const wallet = state.web3.wallet;
			const contract = new web3.eth.Contract(mining_abi as AbiItem[], mining_contract);
			const eggValue = await contract.methods.calculateEggSell(2592000).call();
			const eggs = parseInt(await contract.methods.getMyEggs().call({ from: wallet }));
			const miners = parseInt(await contract.methods.getMyMiners().call({ from: wallet }));
			const lastSecondsUntilFull = 900 - (eggs / miners);

			store.dispatch(update_miners(miners));
			store.dispatch(update_lastSecondsUntilFull(lastSecondsUntilFull));

			if (wallet) {
				if (miners > 0) {
					const minerValue = 1.05 * parseFloat(state.web3.provider.utils.fromWei(eggValue, "ether"));
					const tvl = minerValue * miners;

					store.dispatch(update_tvl(tvl));
				}

				if (miners > 0 && eggs > 0) {
					const myMinersValueBig = await contract.methods.calculateEggSell(eggs).call();
					const myMinersValue = parseFloat(state.web3.provider.utils.fromWei(myMinersValueBig, "ether"));
					const devFee = parseFloat(state.web3.provider.utils.fromWei(await contract.methods.devFee(myMinersValueBig).call(), "ether"));
					const inBarrel = myMinersValue - devFee;
					const fullBarrel = (86400 * inBarrel) / Math.min(2592000 - lastSecondsUntilFull, 86400);

					store.dispatch(update_inBarrel(inBarrel));
					store.dispatch(update_fullBarrel(fullBarrel));
				}
				store.dispatch(update_ready(true));
			} else {
				store.dispatch(reset_web3());
				store.dispatch(reset_mining());
			}
		}
	} catch (error: any) {
		console.error(error);
		store.dispatch(reset_web3());
		store.dispatch(reset_mining());
		store.dispatch(update_ready(false));
	}
}

(() => {
	listen();

	const htmlElementName: string = 'app';
	const jsxElement: JSX.Element = (
		<Provider store={store}>
			<BrowserRouter>
				<Router />
			</BrowserRouter>
		</Provider>
	);
	const htmlElement: HTMLElement | null = document.getElementById(htmlElementName);
	if (htmlElement) {
		ReactDom.render(jsxElement, htmlElement);
	} else {
		throw new Error(`Can\'t find HTML element: ${htmlElementName}`);
	}
})();

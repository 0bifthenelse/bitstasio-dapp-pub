import React from 'react';
import { HashRouter as Router, Route, useLocation, useParams, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import HttpNotFound from './components/NotFound';

import Menu from './components/Menu/Menu';
import MenuSticky from './components/Menu/MenuSticky';

import Index from './components/Farms/Index';
import Farm from './components/Farms/Farm';
import Transfer from './components/Transfer/Transfer';
import Gambling from './components/Gambling/Gambling';

import { Web3ContextProvider } from "react-dapp-web3";

export default function () {
	const urlParams = new URLSearchParams(location.search);
	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	return (
		<Web3ContextProvider>
			<ThemeProvider theme={darkTheme}>
				<main>
					<Menu />
					<MenuSticky />
					<div className="container-fluid">
						<div className="main">
							<div className="row">
								<div className="col-xl-12 no-padding">
									<AnimatePresence exitBeforeEnter>
										<Routes>
											<Route index element={<Index />} />
											<Route path="/farms" element={<Index />} />
											<Route path="farm/:address" element={<Farm />} />
											<Route path="/transfer" element={<Transfer />} />
											<Route path="/jackpot" element={<Gambling />} />
										</Routes>
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>
				</main>
			</ThemeProvider>
		</Web3ContextProvider>
	);
}
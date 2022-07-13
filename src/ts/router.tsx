import React from 'react';
import { HashRouter as Router, Route, Switch, useLocation, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import HttpNotFound from './components/pages/NotFound';

import Index from './components/pages/Index';
import Header from './components/Header';

import { Web3ContextProvider } from "react-dapp-web3";

export default function Routes() {
	const location = useLocation();
	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	return (
		<Web3ContextProvider>
			<ThemeProvider theme={darkTheme}>
				<Header />
				<main>
					<div className="container">
						<AnimatePresence exitBeforeEnter>
							<Switch location={location} key={location.pathname}>
								<Route exact path="/" ><Index /></Route>
								<Route><HttpNotFound /></Route>
							</Switch>
						</AnimatePresence>
					</div>
				</main>
			</ThemeProvider>
		</Web3ContextProvider>
	);
}
import React from 'react';
import { HashRouter as Router, Route, Switch, useLocation, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import HttpNotFound from './components/NotFound';

import Menu from './components/Menu/Menu';

import Farms from './components/Farms/Farms';
import Calculator from './components/Farms/Calculator/Calculator';
import Referral from './components/Referral/Referral';

import { Web3ContextProvider } from "react-dapp-web3";

export default function Routes() {
	const urlParams = new URLSearchParams(location.search);
	const ref = urlParams.get('ref');
	const path = useLocation();
	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	return (
		<Web3ContextProvider>
			<ThemeProvider theme={darkTheme}>
				<main>
					<div className="container-fluid">
						<div className="main">
							<Menu />
							<div className="row">
								<div className="col-xxl-3 col-xl-3 col-md-2 d-none d-md-block"></div>
								<div className="col-xxl-6 col-xl-6 col-md-8 col-sm-12">
									<AnimatePresence exitBeforeEnter>
										<Switch location={path} key={path.pathname}>
											<Route exact path="/" ><Redirect to={ref ? `/farms?ref=${ref}` : "/farms"} /></Route>
											<Route path="/farms" ><Farms /></Route>
											<Route path="/calculator" ><Calculator /></Route>
											<Route path="/referral" ><Referral /></Route>
											<Route><HttpNotFound /></Route>
										</Switch>
									</AnimatePresence>
									<div className="col-xxl-3 col-xl-3 col-md-2 d-none d-md-block"></div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</ThemeProvider>
		</Web3ContextProvider>
	);
}
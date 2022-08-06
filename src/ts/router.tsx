import React from 'react';
import { HashRouter as Router, Route, Switch, useLocation, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import HttpNotFound from './components/pages/NotFound';

import Header from './components/Header';
import Activity from './components/Activity';
import Brand from './components/Brand';

import Farms from './components/sub/Farms/Farms';
import Calculator from './components/sub/Calculator/Calculator';
import Referral from './components/sub/Referral/Referral';

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
				<Activity />
				<main>
					<div className="container-fluid">
						<div className="main">
							<div className="row">
								<div className="col-xxl-3 col-xl-3 col-md-2 d-none d-md-block"></div>
								<div className="col-xxl-6 col-xl-6 col-md-8 col-sm-12">
									<div className="index">
										<Header />
										<AnimatePresence exitBeforeEnter>
											<Switch location={path} key={path.pathname}>
												<Route exact path="/" ><Redirect to={ref ? `/farms?ref=${ref}` : "/farms"} /></Route>
												<Route path="/farms" ><Farms /></Route>
												<Route path="/calculator" ><Calculator /></Route>
												<Route path="/referral" ><Referral /></Route>
												<Route><HttpNotFound /></Route>
											</Switch>
										</AnimatePresence>
									</div>
									<div className="col-xxl-3 col-xl-3 col-md-2 d-none d-md-block"></div>
								</div>
							</div>
						</div>
					</div>
				</main>
				<Brand />
			</ThemeProvider>
		</Web3ContextProvider>
	);
}
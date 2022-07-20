import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import '../scss/index.scss';
import 'regenerator-runtime/runtime';

import store from './redux/store';
import Router from './router';
import subscribe from './utils/subscribe';

(() => {
	subscribe();

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

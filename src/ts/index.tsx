import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import '../scss/index.scss';
import 'regenerator-runtime/runtime';

import store from './redux/store';
import Router from './router';
import subscribe from './utils/subscribe';

(() => {
	subscribe();

	const jsxElement: JSX.Element = (
		<Provider store={store}>
			<BrowserRouter>
				<Router />
			</BrowserRouter>
		</Provider>
	);
	const htmlElement: HTMLElement | null = document.getElementById('app');
	if (htmlElement) {
		const root = createRoot(htmlElement);

		root.render(jsxElement);
	} else {
		throw new Error(`Can\'t find HTML element: app`);
	}
})();

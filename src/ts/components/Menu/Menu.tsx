import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Computer from './Sub/Computer';
import Mobile from './Sub/Mobile';

export default function Menu() {
	const is_large = useMediaQuery({ query: '(min-width: 768px)' });

	return (
		<div className="menu">
			<Link to="/">
				<span className="logo">
					<img src="/img/header.png" alt="Logo" />
				</span>
			</Link>

			{is_large &&
				<Computer />
			}
			{!is_large &&
				<Mobile />
			}
		</div>
	);
}
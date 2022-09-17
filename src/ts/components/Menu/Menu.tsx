import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
	update_container_hover,
} from 'slice/menu';

import Computer from './Sub/Computer';
import Mobile from './Sub/Mobile';

export default function Menu() {
	const dispatch = useDispatch();

	const is_large = useMediaQuery({ query: '(min-width: 768px)' });

	return (
		<div className="menu"
			onMouseEnter={() => dispatch(update_container_hover(true))}
			onMouseLeave={() => dispatch(update_container_hover(false))}
		>
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
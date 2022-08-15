import React from 'react';
import { useDispatch } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from 'react-responsive';
import {
	update_container_hover,
} from 'slice/menu';

import Content_Large from './Sub/Content_Large';
import Content_Mobile from './Sub/Content_Mobile';
import Button_Large from './Sub/Button_Large';
import Button_Mobile from './Sub/Button_Mobile';

function MenuLarge() {
	return (
		<>
			<Button_Large menu="wallet" text="Wallet" />
			<Button_Large menu="products" text="Products" />
			<Button_Large menu="socials" text="Socials" />
			<Content_Large />
		</>
	);
}

function MenuMobile() {
	const [state, setState] = React.useState({
		top: false
	});

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setState({ ...state, ["top"]: open });
	};

	return (
		<div>
			<React.Fragment key={'top'}>
				<Button_Mobile open={toggleDrawer} />
				<Drawer
					sx={{
						zIndex: 99999999
					}}
					anchor={'top'}
					open={state['top']}
					onClose={toggleDrawer(false)}
				>
					<div className="close-mobile">
						<IconButton color="primary" aria-label="Close menu" onClick={toggleDrawer(false)}>
							<CloseIcon sx={{ fontSize: 40 }} />
						</IconButton>
					</div>
					<Content_Mobile close={toggleDrawer} />
				</Drawer>
			</React.Fragment>
		</div>
	);
}

export default function Menu() {
	const dispatch = useDispatch();

	const is_large = useMediaQuery({ query: '(min-width: 920px)' });

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
				<MenuLarge />
			}
			{!is_large &&
				<MenuMobile />
			}
		</div>
	);
}
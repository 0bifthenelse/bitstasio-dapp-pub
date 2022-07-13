import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Referal from './sub/Header/Referal';
import Wallet from './sub/Header/Wallet';

export default function Menu() {
	return (
		<div className="header">
			<div className="row">
				<div className="col-xxl-4 col-xl-3 col-md-2 d-none d-md-block"></div>
				<div className="col-xxl-4 col-xl-6 col-md-8 col-sm-12">
					<div className="menu row">
						<Referal />
						<Wallet />
					</div>
				</div>
				<div className="col-xxl-4 col-xl-3 col-md-2 d-none d-md-block"></div>
			</div>
		</div>
	);
}
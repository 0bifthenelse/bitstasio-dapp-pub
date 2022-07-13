import React from 'react';

import Main from '../sub/Index/Main';
import Barrel from '../sub/Index/Barrel';
import Hire from '../sub/Index/Hire';
import Information from '../sub/Index/Information';
import Guide from '../sub/Index/Guide';

import Link from '../sub/Index/Link';

export default function Index() {
	return (
		<div className="container-fluid">
			<div className="index">
				<div className="banner">
					<img className="img-fluid" src="/img/logo-text.png" alt="Banner" />
				</div>
				<div className="links">
					<Link name="twitter" url="https://twitter.com/PepeTheMiner" />
					<Link name="telegram" url="https://t.me/pepeminer" />
					<Link name="bscscan" url="https://bscscan.com/address/0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c" />
				</div>
				<div className="row">
					<div className="col-xxl-4 col-xl-3 col-md-2 d-none d-md-block"></div>
					<div className="col-xxl-4 col-xl-6 col-md-8 col-sm-12">
						<Guide />
						<Barrel />
						<Hire />
						<Main />
					</div>
					<div className="col-xxl-4 col-xl-3 col-md-2 d-none d-md-block"></div>
				</div>
				<div className="information row">
					<div className="col-xxl-2 col-xl-1 col-md-1 d-none d-sm-block"></div>
					<div className="col-xxl-8 col-xl-10 col-md-10 col-sm-12 col-xs-12">
						<Information />
					</div>
					<div className="col-xxl-2 col-xl-1 col-md-1 d-none d-sm-block"></div>
				</div>
			</div>
		</div>
	);
}
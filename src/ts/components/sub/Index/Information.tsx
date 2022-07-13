import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Sustainability() {
	return (
		<div className="information-box">
			<div className="title">Sustainability</div>
			<p>
				Pepe Miner is sustained by continued community support, just like every other crypto coin, token or project. The difference is, Pepe Miner also has an algorithm that doesn't allow others to instantly dump their coins on the community.
			</p>
			<p>
				Pepe Miner also allows you to stabilize and increase your TVL by taking long-term advantage of its compound feature.
			</p>
		</div>
	);
}

function MinerInfo() {
	return (
		<div className="information-box">
			<div className="title">Miner info</div>
			<p>
				Pepe Miner is designed for individuals with a long-term vision. It is not for those who want instant profits that ultimately harm others. Miners can be viewed as internal tokens whose value rises and falls based on the combined actions of the community, just like any other coin or token that you may hold. But, unlike your average coins and tokens, Pepe Miner allows you to stabilize and increase your TVL by taking long-term advantage of its compound feature.
			</p>
			<p>
				TVL is your current estimated "total value locked", an estimated value of your total miners. Once miners are hired, they work for you indefinitely, therefore your TVL can not be withdrawn in one lump sum. When you hire miners , they fill your barrel with BNB throughout the day with an estimated daily total of 3% of your TVL. You can pocket or compound the BNB accumulated in your barrel at any time. Pocketing too often will ensure a decrease in TVL, which in turn will ensure a decrease in your daily payouts. The value of miners continuously increases and decreases throughout the day, therefore it is normal to see your personal TVL fluctuating as your barrel continues to fill.
			</p>
		</div>
	);
}

function Contract() {
	return (
		<div className="information-box">
			<div className="title">Verified public contract</div>
			<p>
				The Pepe Miner contract is public, verified and can be viewed here on <a href="https://bscscan.com/address/0x6aA27eb73eC69BE5189Fb5a56e6a71Bc84A0243c" target="_blank">BSCScan</a>.
			</p>
			<p>
				It's a fork of another miner that has been live for more than a year, and this miner uses less fees than the original one. Win-win!
			</p>
		</div>
	);
}

function Referrals() {
	return (
		<div className="information-box">
			<div className="title">Referrals</div>
			<p>
				By sharing your Pepe Miner referral link, our contract pays you a 10% referral fee when anyone uses your link to hire miners. You can find your link on the top of this app!
			</p>
		</div>
	);
}

export default function Information() {
	return (
		<>
			<div className="row">
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-6"><Sustainability /></div>
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-6"><Contract /></div>
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12"><MinerInfo /></div>
			</div>

			<Referrals />
		</>
	);
}


import React from 'react';

function Social(props: { name: string, link: string; }) {
	return (
		<div className="social">
			<a href={props.link} target="_blank"><img src={`/img/socials/${props.name}.svg`} alt="Social link" /></a>
		</div>
	);
}

export default function Brand() {
	return (
		<div className="brand">
			<img src="/img/brand.png" alt="Bitstasio" />

			<div className="socials">
				<Social name="twitter" link="https://twitter.com/Bitstasio" />
				<Social name="telegram" link="https://t.me/bitstasioportal" />
				<Social name="discord" link="https://discord.gg/2DsfdS9us8" />
			</div>
		</div>
	);
}
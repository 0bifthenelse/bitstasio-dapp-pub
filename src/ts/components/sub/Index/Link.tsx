import React from 'react';

interface Props {
	name: string;
	url: string;
}

export default function Link(props: Props) {
	return (
		<div className="link">
			<a href={props.url} target="_blank"><img src={`/svg/${props.name}.svg`} alt="Icon" /></a>
		</div>
	);
}
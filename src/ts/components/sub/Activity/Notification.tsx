import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import store from '../../../redux/store';

import {
	remove_queue
} from '../../../redux/slice/activity';

function text(origin: ActivityOrigin, value: string) {
	const value_format = parseFloat(value).toFixed(4);

	switch (origin) {
		case "compound": {
			return ` compounded.`;
		}
		case "deposit": {
			return ` deposited funds.`;
		}
		case "claim": {
			return ` claimed rewards.`;
		}
	}
}

interface Props {
	hash: string;
	origin: ActivityOrigin;
	from: string;
	value: string;
	index: number;
	left: number;
}

export default function Notification(props: Props) {
	const [to_delete, set_to_delete] = React.useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const wallet = props.from.substring(0, 6);
	// @ts-ignore
	const position = ref.current;
	const x = position?.getBoundingClientRect().x ?? 0;

	if (position && x < -400 && !to_delete) {
		set_to_delete(true);

		setTimeout(() => {
			store.dispatch(remove_queue());
		}, 0);
	}

	return (
		<span ref={ref} className="notification" style={{ left: `calc(100% + ${props.left}px)` }}>
			<a href={`https://bscscan.com/tx/${props.hash}`} target="_blank">{wallet} {text(props.origin, props.value)}</a>
		</span>
	);
}


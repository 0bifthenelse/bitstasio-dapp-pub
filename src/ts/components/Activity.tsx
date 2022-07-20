import React from 'react';
import { useSelector } from 'react-redux';
import Notification from './sub/Activity/Notification';

function List() {
	const list: Array<JSX.Element> = [];
	const queue: Array<Activity> = useSelector((state: any) => state.activity.queue);

	if (queue.length > 0) {
		for (const index in queue) {
			const activity = queue[index];
			const left = activity.left;

			list.push(
				<Notification index={parseInt(index)} left={left} key={activity.hash} hash={activity.hash} origin={activity.origin} from={activity.from} value={activity.value} />
			);
		}
	}

	return (
		<>
			{list}
		</>
	);
}

export default function Activity() {
	const queue: Array<Activity> = useSelector((state: any) => state.activity.queue);
	const length = queue.length;

	return (
		<div className="activity" style={{ transform: length > 0 ? "translateY(0)" : "translateY(35px)" }}>
			<List />
		</div >
	);
}

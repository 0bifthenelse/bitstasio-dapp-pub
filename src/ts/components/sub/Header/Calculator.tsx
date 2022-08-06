import React from 'react';
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';
import CalculateIcon from '@mui/icons-material/Calculate';
import Tooltip from '@mui/material/Tooltip';

export default function Calculator() {
	const ref = useSelector((state: any) => state.currency.referral);

	return (
		<Link to={ref ? `/calculator?ref=${ref}` : "/calculator"}>
			<Tooltip title={`Predict your future income.`} arrow>
				<span>
					<IconButton aria-label="calculator">
						<CalculateIcon style={{ fontSize: "26px" }} />
					</IconButton>
				</span>
			</Tooltip>
		</Link>
	);
}

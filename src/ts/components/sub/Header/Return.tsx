import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';

export default function Return() {
	const ref = useSelector((state: any) => state.currency.referral);

	return (
		<Link to={ref ? `/farms?ref=${ref}` : "/farms"}>
			<Tooltip title={`Return to farms`} arrow>
				<span>
					<IconButton aria-label="return">
						<ArrowBackIcon style={{ fontSize: "26px" }} />
					</IconButton>
				</span>
			</Tooltip>
		</Link>
	);
}

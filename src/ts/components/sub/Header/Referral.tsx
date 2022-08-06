import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LinkIcon from '@mui/icons-material/Link';
import Tooltip from '@mui/material/Tooltip';


export default function Referral() {
	const ref = useSelector((state: any) => state.currency.referral);

	return (
		<Link to={ref ? `/referral/?ref=${ref}` : "/referral"}>
			<Tooltip title={`Get your referral link.`} arrow>
				<span>
					<IconButton aria-label="referral">
						<LinkIcon style={{ fontSize: "26px" }} />
					</IconButton>
				</span>
			</Tooltip>
		</Link>
	);
}


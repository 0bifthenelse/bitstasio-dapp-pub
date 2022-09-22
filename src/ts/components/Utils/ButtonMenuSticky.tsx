import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RotateRightIcon from '@mui/icons-material/RotateRight';

interface Props {
  text: string;
  icon: JSX.Element;
  loading: boolean;
  onClick: Function;
}

export default function ButtonMenuSticky(props: Props) {
  if (props.loading) return (
    <IconButton>
      <RotateRightIcon className="spin-fast" />
      </IconButton>
  ); else return (
    <Tooltip onClick={() => props.onClick()} title={props.text} placement="top" arrow>
      <IconButton>
        {props.icon}
      </IconButton>
    </Tooltip>
  );
}
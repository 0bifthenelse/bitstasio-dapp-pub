import React from 'react';
import {Link} from 'react-router-dom';
import FirstPageIcon from '@mui/icons-material/FirstPage';

interface Props {
  text: string;
  url: string;
}

export default function ButtonInternal(props: Props) {
  return (
    <Link to={props.url} className="button-internal">
      <span className="icon-blank"><FirstPageIcon sx={{ fontSize: 25}} /></span>
      <span className="text">{props.text}</span>
    </Link>
  );
}
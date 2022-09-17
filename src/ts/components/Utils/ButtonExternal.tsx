import React from 'react';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface Props {
  text: string;
  url: string;
  icon: JSX.Element;
}

export default function ButtonExternal(props: Props) {
  if (props.url == "") return (
    <div
      className="button-external button-external-disabled"
    >
      <span className="icon" >{props.icon}</span>
      <span className="text">{props.text}</span>
      <span className="icon-blank"><TrendingFlatIcon sx={{ fontSize: 40 }} /></span>
    </div>
  ); else return (
    <a
      href={props.url}
      className="button-external"
      target="_blank"
    >
      <span className="icon" >{props.icon}</span>
      <span className="text">{props.text}</span>
      <span className="icon-blank"><TrendingFlatIcon sx={{ fontSize: 40 }} /></span>
    </a>
  );
}
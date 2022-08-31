import React from 'react';
import Chip from '@mui/material/Chip';
import LaunchIcon from '@mui/icons-material/Launch';

interface Props {
  text: string;
  url: string;
}

export default function ButtonSmall(props: Props) {
  return (
    <Chip
      label={props.text}
      component="a"
      style={{
        padding: "15px 20px",
        margin: "0 10px"
      }}
      icon={<LaunchIcon />}
      variant='filled'
      href={props.url}
      target="_blank"
      clickable />
  );
}
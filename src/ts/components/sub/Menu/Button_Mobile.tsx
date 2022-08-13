import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Button_Mobile(props: { open: Function; }) {
  return (
    <span className="hamburger">
      <IconButton color="primary" aria-label="Close menu" onClick={props.open(true)}>
        <MenuIcon sx={{
          fontSize: 60,
          color: "white"
        }} />
      </IconButton>
    </span>
  );
}
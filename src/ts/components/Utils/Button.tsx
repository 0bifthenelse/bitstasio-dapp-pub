import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  addedClass?: string;
  text: string;
  textLoading: string;
  active: boolean;
  loading: boolean;
  onClick: Function;
}

export default function Button(props: Props) {
  function onClick() {
    if (props.active) return props.onClick();
  }

  return (
    <div
      className={props.active ? `${props.addedClass ?? ""} button` : "button button-inactive"}
      onClick={() => onClick()}
    >
      {props.loading &&
        <CircularProgress disableShrink sx={{ animationDuration: "1000ms"}} className="loading-circular" />
      }
      {props.loading ? props.textLoading : props.text}
    </div>
  );
}
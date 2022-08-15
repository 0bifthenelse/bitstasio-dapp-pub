import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


export default function Loading() {
  return (
    <div className="loading">
      <CircularProgress disableShrink
        sx={{
          color: "white",
          margin: "0 auto",
          animationDuration: '500ms',
        }}
        size={80}
      />
    </div>
  );
}
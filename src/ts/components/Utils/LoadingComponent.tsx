import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReportIcon from '@mui/icons-material/Report';
import CircularProgress from '@mui/material/CircularProgress';

import {
  is_network_supported
} from 'utils/rpc';

interface Props {
  message_waiting: string;
  message_error: string;
}

export default function LoadingComponent(props: Props) {
  const [error, setError] = React.useState(false);

  const chain_id = useSelector((state: any) => state.web3.network);

  const is_supported = is_network_supported(chain_id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(true);
    }, 10000);

    return () => clearTimeout(timer);
  });

  function message() {
    if (error && !is_supported) return "The blockchain you are connected to is not supported by Bitstasio.";

    return error ? props.message_error : props.message_waiting;
  }

  return (
    <>
      <div className="loading-component">
        {!error &&
          <CircularProgress disableShrink
            sx={{
              color: "white",
              margin: "0 auto",
              animationDuration: '1200ms',
            }}
            size={80}
          />
        }
      </div>

      <div className="loading-component-message">
        <p>{message()}</p>
      </div>
    </>
  );
}
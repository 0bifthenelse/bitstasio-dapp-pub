import React from 'react';
import StreamIcon from '@mui/icons-material/Stream';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector } from 'react-redux';

import {
  get_wallet_link
} from 'utils/data';

export default function Game() {
  const winner = useSelector((state: any) => state.jackpot.last_deposit);
  const active = useSelector((state: any) => state.jackpot.active);
  const victory = !active && winner != "0x0000000000000000000000000000000000000000";

  return (
    <div className="game">
      <div className="wrap">
        <Header />
      </div>

      <Progress active={active} victory={victory} />

      <div className="wrap">
        <div className="potential-winner">
          <div className="title">{victory ? "Winner" : "Potential winner"}</div>
          <div className="winner">{get_wallet_link(winner, false)}</div>
        </div>

        <Details />
      </div>
    </div>
  );
}

function Header() {
  const is_live = useSelector((state: any) => state.jackpot.active);
  const round = useSelector((state: any) => state.jackpot.round);

  function live() {
    const sx = { position: "relative" };

    if (is_live) return (
      <>
        <StreamIcon sx={sx} /> Live
      </>
    ); else return (
      <>
        <StreamIcon sx={sx} /> Inactive
      </>
    );
  }

  return (
    <div className="header">
      <span className="state">{live()}</span>
      <span className="round">Round #{round}</span>
    </div>
  );
}

function Progress(props: { victory: boolean; active: boolean; }) {
  const active = useSelector((state: any) => state.jackpot.active);
  const last_depositor = useSelector((state: any) => state.jackpot.last_deposit);
  const blocks_to_win = useSelector((state: any) => state.jackpot.blocks_to_win);
  const remaining_block = useSelector((state: any) => state.jackpot.remaining_block);
  const percent = active && last_depositor != "0x0000000000000000000000000000000000000000" ? blocks_to_win > 0 ? (1 - (remaining_block / blocks_to_win)) * 100 : 0 : 0;

  if (props.victory || !props.active) return (
    <></>
  ); else return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="determinate" sx={{ height: "42px" }} value={percent} valueBuffer={100} />
    </Box>
  );
}

function Details() {
  const winner = useSelector((state: any) => state.jackpot.last_deposit);
  const prize = parseFloat(useSelector((state: any) => state.jackpot.balance)).toFixed(3);

  return (
    <div className="details">
      <div className="part">
        <div className="line">Prize pool</div>
        <div className="content">{prize} BNB</div>
      </div>

      <div className="part">
        <div className="line">Minimum deposit</div>
        <div className="content">0.042 BNB</div>
      </div>

      <div className="part">
        <div className="line">Maximum deposit</div>
        <div className="content">1.000 BNB</div>
      </div>

      <div className="part">
        <div className="line">Last participant</div>
        <div className="content">{get_wallet_link(winner)}</div>
      </div>
    </div>
  );
}
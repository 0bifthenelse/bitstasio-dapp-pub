import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CodeIcon from '@mui/icons-material/Code';
import Box from '@mui/material/Box';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StreamIcon from '@mui/icons-material/Stream';
import numberSeparator from 'number-separator';
import {
  set_subscribe_jackpot
} from 'slice/subscription';
import store from "store";

import * as loading from 'slice/loading';
import * as data from 'utils/data';
import JackpotArbitrator from 'utils/arbitrator/jackpot';

import {
  get_wallet_explorer,
  get_blockchain_coin_name
} from 'utils/rpc';

import Button from "../../Utils/Button";
import LoadingComponent from '../../Utils/LoadingComponent';
import ButtonExternal from '../../Utils/ButtonExternal';

export default function () {
  const dispatch = useDispatch();

  const min = useSelector((state: any) => state.jackpot.min);
  const chain_id = useSelector((state: any) => state.web3.network);
  const coin = get_blockchain_coin_name(chain_id);
  const blocks_to_win = useSelector((state: any) => state.jackpot.blocks_to_win);

  const is_loading = min == 0 || blocks_to_win == 0;

  useEffect(() => {
    dispatch(set_subscribe_jackpot(true));

    return () => dispatch(set_subscribe_jackpot(false));
  });

  if (is_loading) return (
    <LoadingComponent
      message_waiting="Connecting to Jackpot.."
      message_error="Could not establish connection."
    />
  ); else return (
    <div className="game col-xl-6 col-lg-8 col-md-10 col-sm-12">
      <Header />
      <Ribbon />
      <PrizeRibbon />
      <div className="jackpot">
        <Card />
      </div>

      <Links />

      <div className="row">
        <Information
          addedClasses="col-md-6 left"
          title="Rules"
          text={`The last depositor in ${numberSeparator(blocks_to_win, ",")} blocks may claim victory and receive the Prize Pool.`}
        />
        <Information
          addedClasses="col-md-6 right"
          title="Participations"
          text={`Playing the game will cost you ${min} ${coin}, and will set you up as the last depositor.`}
        />
      </div>
      <Information
        title="Disclaimer"
        text="This is a risky game: loosers can't recover their deposited funds, unless they win and claim the entire Prize Pool. High risk, high reward!"
      />
    </div>
  );
}

function Header() {
  const chain_id = useSelector((state: any) => state.web3.network);
  const balance = parseFloat(useSelector((state: any) => state.jackpot.balance));
  const prize = balance.toFixed(2);
  const coin = get_blockchain_coin_name(chain_id);
  const active = useSelector((state: any) => state.jackpot.active);

  function Subtitle() {
    if (active && balance > 0) return (
      <div className="subtitle">Be the last depositor, & earn {prize} {coin}!</div>
    ); else if (active && balance == 0) return (
      <div className="subtitle">Become the first depositor!</div>
    ); else return (
      <div className="subtitle">Waiting for the game to start.</div>
    );
  }

  return (
    <div className="header">
      <div className="title">Jackpot</div>
      <Subtitle />
    </div>
  );
}

function Card() {
  const active = useSelector((state: any) => state.jackpot.active);
  const is_admin = useSelector((state: any) => state.jackpot.admin);

  function Pending() {
    return (
      <div className="pending">
        <p>
          No active round.
        </p>
      </div>
    );
  }

  return (
    <>
      {(active || is_admin) &&
        <div className="wrap">
          <Prize />
          <Progress />
          <Details />
          <Interaction />
        </div>
      }
      {!active && !is_admin &&
        <div className="wrap">
          <Pending />
        </div>
      }
      <History />
    </>
  );
}

function Details() {
  function LastDepositor() {
    const active = useSelector((state: any) => state.jackpot.active);
    const wallet = useSelector((state: any) => state.jackpot.last_deposit);
    const chain_id = useSelector((state: any) => state.web3.network);
    const link = active && wallet != "0x0000000000000000000000000000000000000000" ? data.get_wallet_link(wallet, true, chain_id) : "none";

    return (
      <div className="details-row">
        <div className="category">Last depositor</div>
        <div className="value">{link}</div>
      </div>
    );
  }

  function RemainingBlocks() {
    const wallet = useSelector((state: any) => state.jackpot.last_deposit);
    const blocks_to_win = useSelector((state: any) => state.jackpot.blocks_to_win);
    const remaining_blocks = useSelector((state: any) => state.jackpot.remaining_block);
    const remaining = wallet != "0x0000000000000000000000000000000000000000" ? numberSeparator(remaining_blocks, ",") : numberSeparator(blocks_to_win, ',');

    return (
      <div className="details-row">
        <div className="category">Remaining blocks</div>
        <div className="value">{remaining}</div>
      </div>
    );
  }

  return (
    <div className="details">
      <RemainingBlocks />
      <LastDepositor />
    </div>
  );
}

function Prize() {
  const chain_id = useSelector((state: any) => state.web3.network);
  const prize = parseFloat(useSelector((state: any) => state.jackpot.balance)).toFixed(3);
  const coin = get_blockchain_coin_name(chain_id);

  return (
    <div className="prize-amount">
      {prize} {coin}
    </div>
  );
}

function Progress() {
  const winner = useSelector((state: any) => state.jackpot.last_deposit);
  const active = useSelector((state: any) => state.jackpot.active);
  const victory = !active && winner != "0x0000000000000000000000000000000000000000";
  const last_depositor = useSelector((state: any) => state.jackpot.last_deposit);
  const blocks_to_win = useSelector((state: any) => state.jackpot.blocks_to_win);
  const remaining_block = useSelector((state: any) => state.jackpot.remaining_block);
  const percent = active && last_depositor != "0x0000000000000000000000000000000000000000" ? blocks_to_win > 0 ? (1 - (remaining_block / blocks_to_win)) * 100 : 0 : 0;

  if (victory) return (
    <></>
  ); else return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant="determinate"
        sx={{ height: "42px" }}
        value={percent}
        valueBuffer={100}
      />
    </Box>
  );
}

function PrizeRibbon() {
  const is_active = useSelector((state: any) => state.jackpot.active);

  return (
    <span className={is_active ? "prize-ribbon ribbon-active" : "prize-ribbon ribbon-inactive"}>
      Prize Pool
    </span>
  );
}

function Ribbon() {
  const is_active = useSelector((state: any) => state.jackpot.active);

  function Status(props: { active: boolean; }) {
    const status = is_active ? "Active" : "Inactive";

    function Icon() {
      if (props.active) return (
        <StreamIcon
          className="spin"
          sx={{
            position: "absolute",
            left: 10,
            bottom: 4,
            fontSize: 26
          }}
        />
      ); else return (
        <BedtimeIcon
          sx={{
            position: "absolute",
            left: 10,
            bottom: 4,
            fontSize: 26
          }}
        />
      );
    }

    return (
      <div className="status col-6">
        <Icon />
        <span>{status}</span>
      </div>
    );
  }

  function Round() {
    const round = useSelector((state: any) => state.jackpot.round);

    return (
      <div className="round col-6">Round #{round}</div>
    );
  }

  return (
    <div className={is_active ? "ribbon ribbon-active" : "ribbon ribbon-inactive"}>
      <div className="row">
        <Status active={is_active} />
        <Round />
      </div>
    </div>
  );
}

function Interaction() {
  const jackpot = JackpotArbitrator.get_json();
  const is_active = useSelector((state: any) => state.jackpot.active);
  const is_victory = useSelector((state: any) => state.jackpot.victory);
  const chain_id = useSelector((state: any) => state.web3.network);
  const balances = useSelector((state: any) => state.currency.balance);
  const loading_start = useSelector((state: any) => state.loading.jackpot.start);
  const loading_deposit = useSelector((state: any) => state.loading.jackpot.deposit);
  const min = useSelector((state: any) => state.jackpot.min);
  const is_admin = useSelector((state: any) => state.jackpot.admin);
  const last_deposit = useSelector((state: any) => state.jackpot.last_deposit);
  const address = jackpot.contract;
  const loading_victory = useSelector((state: any) => state.loading.jackpot.claim);

  const coin_name = get_blockchain_coin_name(chain_id);
  const balance_coin = balances ? data.get_coin_balance(balances, chain_id) : 0;

  const is_insufficient = min > balance_coin;
  const is_last = last_deposit == useSelector((state: any) => state.web3.wallet);

  const play_text = (): string => {
    if (is_last) return `You are last depositor`;
    else if (is_insufficient) return `You need ${min} ${coin_name}`;
    else return "Play";
  };

  if (is_admin) return (
    <div className="interaction">
      <div className="admin">
        <Button
          addedClass="button-admin"
          text="Start a new round"
          textLoading="Starting round.."
          active={!is_active}
          loading={loading_start}
          onClick={() => !is_active ? start(address) : null}
        />
      </div>
    </div>
  );

  return (
    <div className="interaction">
      <div className="row">
        <div className="deposit-form left col-sm-6 col-xs-12">
          <Button
            addedClass="button-victory"
            text="Claim victory"
            textLoading="Claiming victory.."
            active={is_active && is_victory}
            loading={loading_victory}
            onClick={() => is_active ? claim(address) : null}
          />
        </div>
        <div className="deposit-form right col-sm-6 col-xs-12">
          <Button
            addedClass="button-deposit"
            text={play_text()}
            textLoading="Playing.."
            active={is_active && !is_insufficient && !is_last}
            loading={loading_deposit}
            onClick={() => is_active && !is_insufficient && !is_last ? deposit(address) : null}
          />
        </div>
      </div>
    </div>
  );
}

function History() {
  const [shown, setShown] = useState(false);

  function Winners() {
    const chain_id = useSelector((state: any) => state.web3.network);
    const history = useSelector((state: any) => state.jackpot.history);

    if (history.length > 0) {
      const history_sorted = history.length > 1 ? history.slice().sort((a: JackpotHistory, b: JackpotHistory) => b.block_number - a.block_number) : history;
      const list: Array<JSX.Element> = [];

      for (const index in history_sorted) {
        if (parseInt(index) < 6) {
          const winner = history_sorted[index];
          const prize = winner.prize.toFixed(3);
          const wallet = winner.wallet.substring(0, 6) + '...' + winner.wallet.substring(winner.wallet.length - 4, winner.wallet.length);
          const wallet_link = get_wallet_explorer(chain_id) + winner.wallet;
          const block_number = numberSeparator(winner.block_number, ',');

          list.push(
            <a
              href={wallet_link}
              className="col-xxl-4 col-xl-6 col-md-6 col-sm-6 col-xs-12"
              target="_blank"
              key={winner.block_number}
            >
              <div className="winner">
                <div className="category">
                  <div className="title">Wallet</div>
                  <div className="value">{wallet}</div>
                </div>
                <div className="category">
                  <div className="title">Prize</div>
                  <div className="value">{prize} {get_blockchain_coin_name(chain_id)}</div>
                </div>
                <div className="category">
                  <div className="title">Block</div>
                  <div className="value">{block_number}</div>
                </div>
              </div>
            </a>
          );
        }
      }

      return (
        <div className="winner-list row col-12">
          {list}
        </div>
      );
    }; return (
      <div className="no-winner">
        There are no previous winners yet.
      </div>
    );
  }

  return (
    <>
      <div
        className={shown ? "history" : "history round"}
        onClick={() => setShown(!shown)}
      >
        Previous winners <ArrowDropDownIcon
          className="arrow-icon"
          sx={{
            marginBottom: "1px",
            transform: shown ? "rotate(180deg)" : "rotate(0deg)"
          }}
        />
      </div>
      <div
        className="history-winners"
        style={{
          transform: `scaleY(${shown ? 1 : 0})`,
          height: shown ? "auto" : 0
        }}
      >
        <div className="history-winners-wrap">
          <Winners />
        </div>
      </div>
    </>
  );
}

function Information(props: { title: string, text: string, addedClasses?: string; }) {
  return (
    <div className={`information ${props.addedClasses ?? ""}`}>
      <div className="wrap">
        <div className="title-pretty">{props.title}</div>
        <div className="text">{props.text}</div>
      </div>
    </div>
  );
}

function Links() {
  const address = useSelector((state: any) => state.jackpot.constant.address);
  const chain_id = useSelector((state: any) => state.jackpot.constant.chain_id);
  const url_audit = useSelector((state: any) => state.jackpot.constant.audit);
  const url_contract = get_wallet_explorer(chain_id) + address;

  return (
    <div className="links">
      <div className="row">
        <div className="col-sm-6 col-xs-12 left">
          <ButtonExternal icon={<CodeIcon sx={{ fontSize: 30 }} />} text="Smart Contract" url={url_contract} />
        </div>
        <div className="col-sm-6 col-xs-12 right">
          <ButtonExternal icon={<VerifiedUserIcon sx={{ fontSize: 30 }} />} text="Security Audit" url={url_audit} />
        </div>
      </div>
    </div>
  );
}

async function deposit(address: string) {
  const state: any = store.getState();
  const balances = state.currency.balance;
  const balance_coin = data.get_coin_balance(balances, state.web3.network);
  const min = state.jackpot.min;
  const error_funds = min > balance_coin;

  if (!error_funds) return JackpotArbitrator.send_deposit(address, min, (is_loading: boolean) => store.dispatch(loading.set_jackpot({ type: "deposit", value: is_loading })));
}

async function claim(address: string) {
  const state: any = store.getState();
  const victory = state.jackpot.victory;

  if (victory) return JackpotArbitrator.send_claim(address, (is_loading: boolean) => store.dispatch(loading.set_jackpot({ type: "claim", value: is_loading })));
}

async function start(address: string) {
  return JackpotArbitrator.send_start(address, (is_loading: boolean) => store.dispatch(loading.set_jackpot({ type: "start", value: is_loading })));
}
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Button from '@mui/material/Button';
import { update_provider } from '../../../redux/slice/web3';
import {
  reset_box_active,
  update_container_hover
} from '../../../redux/slice/menu';

import store from '../../../redux/store';

import {
  net
} from '../../../constants';

import {
  currency_find
} from '../../../utils/data';

function No_Wallet() {
  async function connect(): Promise<void> {
    store.dispatch(reset_box_active());

    const providerOptions = {
      binancechainwallet: {
        package: true
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            56: 'https://bsc-dataseed.binance.org/'
          },
          network: 'mainnet',
        }
      }
    };
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);

    store.dispatch(update_provider(web3));
  }

  return (
    <div className="err">
      <div className="wrap">
        <div className="msg">No wallet connected.</div>
        <div className="act">
          <Button variant="outlined" onClick={() => connect()}>
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}

function Wrong_Network() {
  async function connect(): Promise<void> {
    const state = store.getState();
    const web3 = state.web3.provider;

    if (web3) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(net.mainnet) }],
      });
    }
  }

  return (
    <div className="err">
      <div className="wrap">
        <div className="msg">Wrong network.</div>
        <Button variant="outlined" onClick={() => connect()}>
          Connect to BNB Smart Chain
        </Button>
      </div>
    </div>
  );
}

function Funds(props: { close?: Function; }) {
  function get_bnb(): { balance: string, name: string; } {
    const index = currency_find(true).id;
    const data = useSelector((state: any) => state.currency.map.get(index));
    const balance = data ? parseFloat(data.amount).toFixed(4) : "0";
    const name = data ? data.name : "pending..";

    return {
      balance: balance,
      name: name
    };
  }

  function get_busd(): { balance: string, name: string; } {
    const index = currency_find(false, "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56").id;
    const data = useSelector((state: any) => state.currency.map.get(index));
    const balance = data ? parseFloat(data.amount).toFixed(2) : "0";
    const name = data ? data.name : "pending..";

    return {
      balance: balance,
      name: name
    };
  }

  const dispatch = useDispatch();
  const wallet = useSelector((state: any) => state.web3.wallet);
  const ref = useSelector((state: any) => state.currency.referral);
  const wallet_shown = 6;
  const wallet_read = wallet.substring(0, wallet_shown) + '...' + wallet.substring(wallet.length - wallet_shown, wallet.length);
  const close_mobile = props.close ? props.close() : null;
  const bnb = get_bnb();
  const busd = get_busd();

  return (
    <div className="wallet-wrap">
      <div className="address">{wallet_read}</div>
      <div className="funds">
        <span className="bnb"><img src={`/img/currencies/${bnb.name.toLowerCase()}.png`} alt="BNB" /></span>
        <span className="amount">{bnb.balance} {bnb.name}</span>
      </div>
      <div className="funds">
        <span className="bnb"><img src={`/img/currencies/${busd.name.toLowerCase()}.png`} alt="BUSD" /></span>
        <span className="amount">{busd.balance} {busd.name}</span>
      </div>

      <div className="ref-link">
        <Link to={ref ? "/referral" + `/?ref=${ref}` : "/referral"}><Button variant="outlined" onClick={() => {
          dispatch(reset_box_active());
          props.close ? dispatch(close_mobile) : null;
        }}>My referral link</Button></Link>
      </div>
    </div>
  );
}

export default function Wallet(props: { mobile?: boolean; close?: Function; }) {
  const active = useSelector((state: any) => state.menu.box_active) == "wallet";
  const wallet = useSelector((state: any) => state.web3.wallet);
  const network = useSelector((state: any) => state.web3.network);

  return (
    <div
      className={!props.mobile ? "menu-content" : ""}
      style={{
        opacity: active || props.mobile ? 1 : 0,
        zIndex: active || props.mobile ? 99 : 0
      }}
    >
      <div className="wallet">
        {!wallet && <No_Wallet />}
        {wallet && !network && <Wrong_Network />}
        {wallet && network && <Funds close={props.close} />}
      </div>
    </div>
  );
}
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Button from '@mui/material/Button';
import { update_provider } from 'slice/web3';
import store from 'store';

import {
  get_blockchain,
  get_blockchain_icon,
  get_wallet_explorer
} from 'utils/rpc';

export default function Wallet(props: { mobile?: boolean; close?: Function; }) {
  const active = useSelector((state: any) => state.menu.box_active) == "wallet";
  const mobile = props.mobile;


  if (mobile) return (
    <div className="mob">
      <div
        className="wallet"
        style={{
          opacity: active || props.mobile ? 1 : 0,
          zIndex: active || props.mobile ? 99 : 0
        }}
      >
        <Blockchain />
        <MyWallet close={props.close} />
      </div>
    </div>
  ); else return (
    <div
      className="wallet"
      style={{
        opacity: active || props.mobile ? 1 : 0,
        zIndex: active || props.mobile ? 99 : 0
      }}
    >
      <Blockchain />
      <MyWallet />
    </div>
  );
}

function Blockchain() {
  const chain_id = useSelector((state: any) => state.web3.network);
  const name = get_blockchain(chain_id);
  const icon = get_blockchain_icon(chain_id);

  return (
    <div className="blockchain">
      <div className="icon"><img src={icon} alt="Blockchain icon" /></div>
      <div className="name">{name}</div>
    </div>
  );
}

function MyWallet(props: { close?: Function; }) {
  const wallet = useSelector((state: any) => state.web3.wallet);

  if (wallet) return (
    <Address wallet={wallet} />
  ); else return (
    <Connect close={props.close} />
  );
}

function Address(props: { wallet: string; }) {
  const chain_id = useSelector((state: any) => state.web3.network);
  const wallet = props.wallet;
  const formatted = wallet.substring(0, 4) + '...' + wallet.substring(wallet.length - 4, wallet.length);
  const link = get_wallet_explorer(chain_id);

  return (
    <a href={`${link}${wallet}`} target="_blank">
      <div className="address">
        {formatted}
      </div>
    </a>
  );
}

function Connect(props: { close?: Function; }) {
  async function onClick() {
    connect();

    if (props.close) store.dispatch(props.close());
  }

  return (
    <div
      className="connect"
      onClick={() => onClick()}
    >
      Connect wallet
    </div>
  );
}

async function connect(): Promise<void> {
  const providerOptions = {
    binancechainwallet: {
      package: true
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
          137: 'https://polygon-rpc.com',
          80001: 'https://rpc-mumbai.maticvigil.com',
        },
      }
    }
  };
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
    theme: "dark"
  });
  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);

  store.dispatch(update_provider(web3));
}
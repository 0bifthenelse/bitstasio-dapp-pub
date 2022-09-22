import React from 'react';
import { useSelector } from 'react-redux';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { update_provider } from 'slice/web3';
import store from 'store';

import Icons from './Icons';

import * as RPC from 'utils/rpc';

export default function Wallet(props: { mobile?: boolean; close?: Function; }) {
  const mobile = props.mobile;

  if (mobile) return (
    <div className="mob">
      <div className="wallet">
        <MyWallet close={props.close} />
        <Blockchain />
      </div>
    </div>
  ); else return (
    <div
      className="wallet">
      <MyWallet />
      <Blockchain />
    </div>
  );
}

function Blockchain() {
  const chain_id = useSelector((state: any) => state.web3.network);
  const name = RPC.get_blockchain(chain_id);
  const icon = RPC.get_blockchain_icon(chain_id);

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
    <>
      <Icons />
      <Address wallet={wallet} />
    </>
  ); else return (
    <>
      <Icons />
      <Connect close={props.close} />
    </>
  );
}

function Address(props: { wallet: string; }) {
  const chain_id = useSelector((state: any) => state.web3.network);
  const wallet = props.wallet;
  const formatted = wallet.substring(0, 4) + '...' + wallet.substring(wallet.length - 4, wallet.length);
  const link = RPC.get_wallet_explorer(chain_id);

  return (
    <a className="mywallet" href={`${link}${wallet}`} target="_blank">
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
      className="connect mywallet"
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
    /**walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "9aa3d95b3bc440fa88ea12eaa4456161",
        rpc: {
          1: RPC.get_rpc_url(1),
          5: RPC.get_rpc_url(5),
          56: RPC.get_rpc_url(56),
          97: RPC.get_rpc_url(97),
          137: RPC.get_rpc_url(137),
          80001: RPC.get_rpc_url(80001),
        },
      }
    }*/
  };
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
    theme: "dark"
  });
  web3Modal.clearCachedProvider();
  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);

  store.dispatch(update_provider(web3));
}
import React from 'react';
import { useSelector } from 'react-redux';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Button from '@mui/material/Button';
import { update_provider } from 'slice/web3';
import {
  reset_box_active
} from 'slice/menu';
import store from 'store';
import {
  get_token_balance,
  get_coin_balance,
  balances
} from 'utils/data';

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
      <div className="err-wrap">
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
        params: [{ chainId: Web3.utils.toHex(56) }],
      });
    }
  }

  return (
    <div className="err">
      <div className="err-wrap">
        <div className="msg">Wrong network.</div>
        <Button variant="outlined" onClick={() => connect()}>
          Connect to BNB Smart Chain
        </Button>
      </div>
    </div>
  );
}

function Funds() {
  function balance_list(map: HashMap<string, Balance>): Array<JSX.Element> {
    const list: Array<JSX.Element> = [];
    const chain_id = useSelector((state: any) => state.web3.network);

    balances((balance: BalanceJSON) => {
      if (balance.chain_id == chain_id && map) {
        const name = balance.name;
        const address = balance.address ?? "";
        const amount = balance.coin ? get_coin_balance(map, chain_id) : get_token_balance(map, chain_id, address);

        list.push(
          <div key={name} className="funds">
            <span className="bnb"><img src={`/img/currencies/${name.toLowerCase()}.png`} alt={name} /></span>
            <span className="amount">{amount.toFixed(4)} {name}</span>
          </div>
        );
      }
    });

    return list;
  }

  const wallet = useSelector((state: any) => state.web3.wallet);
  const wallet_shown = 6;
  const wallet_read = wallet.substring(0, wallet_shown) + '...' + wallet.substring(wallet.length - wallet_shown, wallet.length);
  const map = useSelector((state: any) => state.currency.balance);

  return (
    <div className="wallet-wrap">
      <div className="address">{wallet_read}</div>

      {balance_list(map)}
    </div>
  );
}

export default function Wallet(props: { mobile?: boolean; close?: Function; }) {
  const active = useSelector((state: any) => state.menu.box_active) == "wallet";
  const wallet = useSelector((state: any) => state.web3.wallet);
  const network = useSelector((state: any) => state.web3.network);

  return (
    <div
      className={!props.mobile ? "content" : ""}
      style={{
        opacity: active || props.mobile ? 1 : 0,
        zIndex: active || props.mobile ? 99 : 0
      }}
    >
      <div className="wallet">
        {!wallet && <No_Wallet />}
        {wallet && !network && <Wrong_Network />}
        {wallet && network && <Funds />}
      </div>
    </div>
  );
}
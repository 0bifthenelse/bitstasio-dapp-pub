import React from 'react';
import { useSelector } from 'react-redux';
import fetch_abi from 'human-standard-token-abi';
import store from 'store';
import { AbiItem, toWei, fromWei } from 'web3-utils';

import * as data from 'utils/data';

import Button from '../../../Utils/Button';

import {
  set_farm_init
} from 'slice/loading';

interface Props {
  address: string;
  token_address?: string;
  coin: boolean;
  initialized: boolean;
  admin: boolean;
}

export default function Pending(props: Props) {
  return (
    <div className="pending">
      <div className="wrap">
        {!props.initialized && !props.admin &&
          <>This farm has not started yet.</>
        }
        {!props.initialized && props.admin &&
          <Admin address={props.address} token_address={props.token_address} coin={props.coin} />
        }
      </div>
    </div>
  );
}

function Admin(props: { address: string, coin: boolean, token_address?: string; }) {
  const loading = useSelector((state: any) => state.loading.farm_init);

  return (
    <div className="admin">
      <Button
        text="Initialize farm"
        textLoading="Initializing.."
        active={true}
        loading={loading}
        onClick={() => !loading ? initialize(props.address, props.coin, props.token_address) : null}
      />
    </div>
  );
}

async function initialize(address: string, coin: boolean, token_address?: string) {
  store.dispatch(set_farm_init(true));

  await new Promise(async (resolve: Function) => {
    const timer = setTimeout(() => resolve(), 30000);

    if (coin) await initialize_coin(address);
    else await initialize_token(address, token_address);

    clearTimeout(timer);

    return resolve();
  });

  store.dispatch(set_farm_init(false));
}

async function initialize_coin(address: string) {
  const state = store.getState();
  const wallet = state.web3.wallet;
  const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);
  const balance = await state.web3.provider.eth.getBalance(wallet);
  const to_seed = toWei("0.000001", "ether");

  if (parseFloat(fromWei(to_seed, "ether")) <= parseFloat(fromWei(balance, "ether"))) {
    await contract.methods.seedMarket().send({ value: to_seed, from: wallet });

    return;
  }

  return console.log("Insufficient coin balance.");

}

async function initialize_token(address: string, token_address: string | undefined) {
  if (token_address) {
    const state = store.getState();
    const wallet = state.web3.wallet;
    const contract = new state.web3.provider.eth.Contract(data.get_abi(address), address);
    const token_contract = new state.web3.provider.eth.Contract(fetch_abi as AbiItem[], token_address);
    const token_balance = await token_contract.methods.balanceOf(wallet).call();
    const to_seed = toWei("0.000001", "ether"); // TODO: handle smaller tokens

    if (parseFloat(fromWei(to_seed, "ether")) <= parseFloat(fromWei(token_balance, "ether"))) {
      await token_contract.methods.approve(address, to_seed).send({ from: wallet });
      await contract.methods.seedMarket(to_seed).send({ from: wallet });

      return;
    }

    return console.log("Insufficient token balance.");
  }
}
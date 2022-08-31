import React from 'react';
import { useSelector } from 'react-redux';
import { AbiItem } from 'web3-utils';
import store from "store";

import Button from "../../../Utils/Button";
import {
  jackpot_abi
} from 'constant';

import {
  set_jackpot
} from 'slice/loading';

import {
  get_jackpot_address
} from 'utils/data';

export default function Admin() {
  return (
    <div className="admin">
      <Actions />
    </div>
  );
}

function Actions() {
  const loading = useSelector((state: any) => state.loading.jackpot.start);
  const active = useSelector((state: any) => state.jackpot.active);

  return (
    <div className="actions">
      {!active &&
        <p>Jackpot is inactive. Press button below to start a new round.</p>
      }
      {active &&
        <p>Jackpot is active.</p>
      }
      <Button
        addedClass="button-start"
        text="Start a new round"
        textLoading="Starting a new round.."
        active={!active}
        loading={loading}
        onClick={() => !active ? start() : null}
      />
    </div>
  );
}

async function start() {
  const state = store.getState();
  const jackpot_address = get_jackpot_address();
  const contract = new state.web3.provider.eth.Contract(jackpot_abi as AbiItem[], jackpot_address);
  const wallet = state.web3.wallet;

  await new Promise(async (resolve: Function): Promise<void> => {
    try {
      store.dispatch(set_jackpot({ type: "start", value: true }));
      const timer = setTimeout(() => resolve(), 30000);

      await contract.methods.start().send({ from: wallet });

      clearTimeout(timer);

      return resolve();
    } catch (error: any) {
      console.error(error);
      store.dispatch(set_jackpot({ type: "start", value: false }));
    }
  });

  store.dispatch(set_jackpot({ type: "start", value: false }));
}
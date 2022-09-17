import store from 'store';

import * as factory from 'slice/factory';

export default async function subscribe_time() {
  setInterval(subscribe_time_since_withdraw, 1000);
}

function subscribe_time_since_withdraw(): void {
  function time_since_date(time: number) {
    const total = new Date().getTime() - (time * 1000);
    const seconds_raw = Math.floor((total / 1000) % 60);
    const minutes_raw = Math.floor((total / 1000 / 60) % 60);
    const hours_raw = Math.floor((total / (1000 * 60 * 60)));
    const zeros = (number: number) => number > 9 ? `${number}` : `0${number}`;

    const hours = zeros(hours_raw);
    const minutes = zeros(minutes_raw);
    const seconds = zeros(seconds_raw);

    return {
      hours,
      minutes,
      seconds
    };
  }

  const state = store.getState();
  // @ts-ignore
  const farms = state.currency.farms.entries();

  for (const [_, farm] of farms) {
    const contract = farm.contract;
    const timestamp_withdraw = farm.timestamp_withdraw;
    const time_since_withdraw = time_since_date(timestamp_withdraw);
    const data = {
      contract: contract,
      time_since_withdraw: timestamp_withdraw > 0 ? `${time_since_withdraw.hours}:${time_since_withdraw.minutes}:${time_since_withdraw.seconds}` : "---"
    };

    store.dispatch(factory.set_time_since_withdraw(data));
  }
}
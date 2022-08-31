import store from 'store';

import {
  set_time_since_withdraw
} from 'slice/currency';

export default async function subscribe_time(once: boolean) {
  if (once) return subscribe_time_since_withdraw;

  return setInterval(subscribe_time_since_withdraw, 1000);
}

async function subscribe_time_since_withdraw(): Promise<void> {
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
  const currencies = state.currency.farms.entries();

  for (const [_, currency] of currencies) {
    const id = currency.id;
    const timestamp_withdraw = currency.timestamp_withdraw;
    const time_since_withdraw = time_since_date(timestamp_withdraw);
    const data = {
      id: id,
      time_since_withdraw: timestamp_withdraw > 0 ? `${time_since_withdraw.hours}:${time_since_withdraw.minutes}:${time_since_withdraw.seconds}` : "---"
    };

    store.dispatch(set_time_since_withdraw(data));
  }
}
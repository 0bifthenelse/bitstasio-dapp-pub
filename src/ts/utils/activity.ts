import {
  set_loading,
  add_queue
} from '../redux/slice/activity';

import store from '../redux/store';

async function notify(hash: string, from: string, origin: ActivityOrigin, value?: string) {
  await new Promise((resolve: Function) => {
    const loop = setInterval(() => {
      // @ts-ignore
      const activity = store.getState().activity;
      // @ts-ignore
      const loading = activity.loading;

      if (!loading) {
        store.dispatch(set_loading());
        clearInterval(loop);
        setTimeout(() => resolve(), 500);
      }
    }, 500);
  });

  const activity = {
    active: true,
    left: 0,
    hash: hash,
    origin: origin,
    from: from,
    value: value
  };

  const state = store.getState();
  // @ts-ignore
  const queue = state.activity.queue;
  const position = notify_position(queue, origin);
  activity.left = position;

  store.dispatch(add_queue(activity));
}

function notify_position(queue: Array<Activity>, origin: ActivityOrigin): number {
  if (queue.length > 0) {
    const long = !(origin == "hire" || origin == "withdraw");
    const index_last = queue.length - 1;
    const position_last = Math.max(queue[index_last].left, 0);

    return position_last + (long ? 400 : 200);
  }

  return 0;
}

export async function compound(hash: string, from: string): Promise<void> {
  notify(hash, from, "compound");
}

export async function hire(hash: string, from: string, value: string): Promise<void> {
  notify(hash, from, "hire", value);
}

export async function withdraw(hash: string, from: string, value: string): Promise<void> {
  notify(hash, from, "withdraw", value);
}
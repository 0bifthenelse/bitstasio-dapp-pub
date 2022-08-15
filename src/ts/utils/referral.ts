import store from '../redux/store';

export function get_referrer(coin: boolean) {
  const state: any = store.getState();
  const ref = state.currency.referral == "" ? "0x9C9e373C794aE23b0e7a0EB95e8390F80C121E7E" : state.currency.referral;

  if (coin) return ref;

  return state.referral.referredBy == "" ? ref : state.referral.referredBy;
}

export function get_url(url: string): string {
  const urlParams = new URLSearchParams(location.search);
  const referral = urlParams.get('ref');

  return (referral) ? (url + `/?ref=${referral}`) : (url);
}
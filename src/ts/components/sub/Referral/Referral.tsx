import React from 'react';
import { useSelector } from 'react-redux';

function Link() {
  const wallet = useSelector((state: any) => state.web3.wallet);
  const link = `https://app.bitstasio.com/farms/?ref=${wallet}`;
  const short = link.substring(0, 22) + "..." + link.substring(link.length - 5, link.length);

  if (wallet) return (
    <div className="link"><a href={link} target="_blank">{short}</a></div>
  );

  else return (
    <div className="link">Connect your wallet</div>
  );
}

function Notes() {
  return (
    <div className="notes">
      <li className="note">Every time a referral buys shares or compounds, you get 10% of the transaction value immediately withdrawable.</li>
      <li className="note">Share your referral link to your friends and on your socials - spreading awareness on Bitstasio helps growing the platform and ultimately increases your own profits.</li>
      <li className="note">Referrals and hyper compounding are the best strategies to make profits on Bitstasio, join our social networks for more information!</li>
    </div>
  );
}

export default function Referral() {
  return (
    <div className="referral">
      <div className="title">Your referral link</div>
      <Link />
      <Notes />
    </div>
  );
}
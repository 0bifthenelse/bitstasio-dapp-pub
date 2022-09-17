import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CodeIcon from '@mui/icons-material/Code';
import ButtonExternal from '../../../Utils/ButtonExternal';

interface Props {
  farm: Farm;
}

export default function Links(props: Props) {
  const contract_address = props.farm.contract;
  const coin = props.farm.coin;
  const url_contract = `https://bscscan.com/address/${contract_address}`;
  const url_audit = props.farm.audit;
  const url_token = `https://pancakeswap.finance/swap?chainId=56&outputFarm=${props.farm.token_contract}&inputFarm=BNB&outputCurrency=${props.farm.token_contract}`;
  const url_guide = "https://medium.com/@bitstasio/how-to-make-profits-with-yield-farms-f840a0d0ea2";

  return (
    <div className="links col-xxl-3 col-xl-5 col-lg-5 col-md-6 col-xs-12">
      <ButtonExternal icon={<CodeIcon sx={{ fontSize: 30 }} />} text="Smart Contract" url={url_contract} />
      <ButtonExternal icon={<VerifiedUserIcon sx={{ fontSize: 30 }} />} text="Security Audit" url={url_audit} />

      {!coin &&
        <ButtonExternal icon={<CurrencyExchangeIcon sx={{ fontSize: 30 }} />} text={`Buy ${props.farm.name} on PancakeSwap`} url={url_token} />
      }
    </div>
  );
}
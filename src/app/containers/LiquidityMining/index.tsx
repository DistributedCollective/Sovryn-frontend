import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { backendUrl, currentChainId } from '../../../utils/classifiers';
import { PoolData } from './components/PoolData';
import {
  getContractNameByAddress,
  getContract,
  symbolByTokenAddress,
} from 'utils/blockchain/contract-helpers';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { translations } from 'locales/i18n';
import { BigNumber, bignumber } from 'mathjs';

type UserData = {
  asset: string;
  pool: string;
  txList: Array<any>;
  totalAdded: string;
  totalRemoved: string;
  totalRemaining: string;
  percentage: string;
  sovReward: string;
};

export function LiquidityMining() {
  const { t } = useTranslation();
  // Get total weighted liquidity and user liquidity
  const [userData, setUserData] = useState<Array<UserData>>([
    {
      asset: getContract('USDT_token').address,
      pool: getContract('USDT_amm').address,
      txList: [],
      totalAdded: '',
      totalRemoved: '',
      totalRemaining: '',
      percentage: '',
      sovReward: '',
    },
    {
      asset: getContract('RBTC_token').address,
      pool: getContract('USDT_amm').address,
      txList: [],
      totalAdded: '',
      totalRemoved: '',
      totalRemaining: '',
      percentage: '',
      sovReward: '',
    },
  ]);
  const url = backendUrl[currentChainId];
  const userAddress = useAccount();
  const isConnected = useIsConnected();

  useEffect(() => {
    if (isConnected) {
      axios
        .get(url + '/amm/liquidity-mining/' + userAddress)
        .then(res => {
          setUserData(res.data);
        })
        .catch(e => console.error(e));
    }
  }, [url, userAddress, isConnected]);

  const BTCData = userData.filter(
    item =>
      getContractNameByAddress(item.pool)?.includes('USDT') &&
      symbolByTokenAddress(item.asset).includes('RBTC'),
  );

  const USDTData = userData.filter(
    item =>
      getContractNameByAddress(item.pool)?.includes('USDT') &&
      symbolByTokenAddress(item.asset).includes('USDT'),
  );

  return (
    <div className="">
      <h1 className="w-100 text-center mb-3">
        Liquidity Mining: USDT/BTC Pool
      </h1>
      <div className="d-flex flex-wrap mb-5"></div>
      <div className="d-flex flex-wrap justify-content-around">
        <PoolData data={BTCData[0]} isConnected={isConnected} />
        <PoolData data={USDTData[0]} isConnected={isConnected} />
      </div>
      {!isConnected && (
        <div className="w-100 my-5 text-center font-family-montserrat font-weight-bold">
          {t(translations.marketingPage.liquidity.connetWallet)}
        </div>
      )}
      <div className="row w-100 text-center p-2">
        <p className="w-100 text-center font-family-montserrat font-italic">
          *{t(translations.marketingPage.liquidity.provider)}
        </p>
      </div>
    </div>
  );
}

import React, { useCallback, useRef, useState } from 'react';
import {
  IPairsData,
  IAssets,
} from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { useInterval } from 'app/hooks/useInterval';
import { SwapStatsPrices } from './components/SwapStatsPrices';
import styles from './index.module.scss';

const refreshInterval = 300000;
const url = backendUrl[currentChainId];

export const SwapStats: React.FC = () => {
  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsData, setPairsData] = useState<IPairsData>();
  const [assetLoading, setAssetLoading] = useState(false);
  const cancelAssetDataRequest = useRef<Canceler>();
  const cancelDataRequest = useRef<Canceler>();
  const cancelPairsDataRequest = useRef<Canceler>();
  const [assetData, setAssetData] = useState<IAssets>();

  const getPairsData = useCallback(() => {
    setPairsLoading(true);
    cancelPairsDataRequest.current && cancelPairsDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/api/v1/trading-pairs/summary', {
        cancelToken,
      })
      .then(res => {
        setPairsData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setPairsLoading(false);
      });
  }, []);

  const getAssetData = useCallback(() => {
    setAssetLoading(true);
    cancelAssetDataRequest.current && cancelAssetDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/api/v1/trading-pairs/assets', {
        cancelToken,
      })
      .then(res => {
        setAssetData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setAssetLoading(false);
      });
  }, []);

  useInterval(
    () => {
      getPairsData();
      getAssetData();
    },
    refreshInterval,
    { immediate: true },
  );

  return (
    <div className="tw-bg-gray-3 tw-w-full tw-mb-10 tw-overflow-hidden">
      <div className={styles.statsContainer}>
        <SwapStatsPrices
          pairs={pairsData?.pairs}
          isLoading={pairsLoading}
          assetData={assetData}
          assetLoading={assetLoading}
        />
      </div>
    </div>
  );
};

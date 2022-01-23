import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { PairNavbarInfo } from 'app/components/PairNavbarInfo';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';
import { IPairsData } from 'types/trading-pairs';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { SpotPairType } from '../../types';

export const PairNavbar: React.FC = () => {
  const location = useLocation();

  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsData, setPairsData] = useState<IPairsData>() as any;
  const cancelDataRequest = useRef<Canceler>();
  const cancelPairsDataRequest = useRef<Canceler>();
  const url = backendUrl[currentChainId];

  const getStorageKey = () => {
    switch (location.pathname) {
      case '/spot':
        return 'spot-pairs';
      default:
        return '';
    }
  };

  const [pair, setPair] = useState([]) as any;

  //getting PAIRS DATA
  const getPairsData = useCallback(() => {
    setPairsLoading(true);
    cancelPairsDataRequest.current && cancelPairsDataRequest.current();
    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/api/v1/trading-pairs/summary/?extra=true', {
        cancelToken,
      })
      .then(res => {
        setPairsData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setPairsLoading(false);
      });
  }, [url, setPairsData]);

  useEffect(() => {
    getPairsData();
  }, [getPairsData]);

  const list = useMemo(() => {
    if (!pairsData) return [];
    return Object.keys(pairsData.pairs)
      .map(key => pairsData.pairs[key])
      .filter(pair => pair);
  }, [pairsData]);

  useEffect(() => {
    if (list)
      // set SOV_RBTC by default
      for (let pair of list) {
        if (pair.trading_pairs === SpotPairType.SOV_RBTC) setPair([pair, pair]);
      }
  }, [list]);

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container twm-mr-2">
        <PairSelect
          storageKey={getStorageKey()}
          onPairChange={pair => setPair(pair)}
          pairsData={pairsData}
        />

        {pair && pair.length && !pairsLoading && <PairNavbarInfo pair={pair} />}
      </div>
    </div>
  );
};

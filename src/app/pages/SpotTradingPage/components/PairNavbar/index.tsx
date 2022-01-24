import React, { useState, useEffect, useCallback } from 'react';
import { PairNavbarInfo } from 'app/components/PairNavbarInfo';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';
import { SpotPairType } from '../../types';
import { useGetCryptoPairs } from 'app/hooks/trading/useGetCryptoPairs';
import { usePairList } from 'app/hooks/trading/usePairList';
import { reactLocalStorage } from 'reactjs-localstorage';
import { actions } from '../../slice';
import { useDispatch } from 'react-redux';

export const PairNavbar: React.FC = () => {
  const location = useLocation();
  const isPairSelected = reactLocalStorage.getObject('selectedSpotPair');
  const dispatch = useDispatch();

  const getStorageKey = () => {
    switch (location.pathname) {
      case '/spot':
        return 'spot-pairs';
      default:
        return '';
    }
  };

  const [pair, setPair] = useState([]) as any;
  const pairsData = useGetCryptoPairs();
  const pairsArray = usePairList(pairsData?.pairs);

  useEffect(() => {
    if (pairsArray && !pair.length)
      // set SOV_RBTC by default
      for (let item of pairsArray) {
        if (item.trading_pairs === SpotPairType.SOV_RBTC) {
          setPair([item, item]);
        }
      }
  }, [pairsArray, pair]);

  const onPairChange = useCallback(pair => {
    setPair(pair);
    if (pair[1] !== pair[0]) {
      reactLocalStorage.setObject('selectedSpotPair', [
        pair[0].base_symbol,
        pair[1].base_symbol,
      ]);
    }
    //filtering pairs for RBTC as target
    if (pair[0].base_symbol === pair[1].base_symbol && !pair[2]) {
      reactLocalStorage.setObject('selectedSpotPair', [
        pair[0].base_symbol,
        pair[1].quote_symbol,
      ]);
    }
    //filtering pairs for RBTC as source
    if (pair[0].base_symbol === pair[1].base_symbol && pair[2]) {
      reactLocalStorage.setObject('selectedSpotPair', [
        pair[0].quote_symbol,
        pair[1].base_symbol,
        pair[2],
      ]);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(isPairSelected).length)
      dispatch(
        actions.setPairType(
          SpotPairType[isPairSelected[0] + '_' + isPairSelected[1]],
        ),
      );
  }, [dispatch, isPairSelected]);

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container twm-mr-2">
        <PairSelect
          storageKey={getStorageKey()}
          onPairChange={onPairChange}
          pairsData={pairsData}
        />

        {pair && pair.length && <PairNavbarInfo pair={pair} />}
      </div>
    </div>
  );
};

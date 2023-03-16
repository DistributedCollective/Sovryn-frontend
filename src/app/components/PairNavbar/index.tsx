import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useDispatch } from 'react-redux';
import { PairNavbarInfo } from 'app/components/PairNavbarInfo';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';
import { SpotPairType } from 'app/pages/SpotTradingPage/types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { useGetCryptoPairs } from 'app/hooks/trading/useGetCryptoPairs';
import { actions as spotActions } from 'app/pages/SpotTradingPage/slice';
import { actions as marginActions } from 'app/pages/MarginTradePage/slice';
import { usePairList } from 'app/hooks/trading/usePairList';
import { ITradingPairs, TradingType } from 'types/trading-pairs';
import { Asset } from 'types/asset';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';

interface IPairNavbarProps {
  type: TradingType;
}

export const PairNavbar: React.FC<IPairNavbarProps> = ({ type }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const marginType = useMemo(() => {
    return type === TradingType.MARGIN;
  }, [type]);

  const localStoreObject = !marginType
    ? 'selectedSpotPair'
    : 'selectedMarginPair';

  const tradingType =
    type === TradingType.SPOT ? SpotPairType : TradingPairType;
  const selectedPair = useMemo(() => {
    const retrieved = reactLocalStorage.getObject(localStoreObject);
    if (tradingType[`${retrieved[0]}_${retrieved[1]}`]) {
      return retrieved;
    }
    return [Asset.SOV, Asset.RBTC];
  }, [localStoreObject, tradingType]);

  const [isOpen, setIsOpen] = useState(false);

  const storageKey = useMemo(() => {
    switch (location.pathname) {
      case '/spot':
        return 'spot-pairs';
      case '/trade':
        return 'trade-pairs';
      default:
        return '';
    }
  }, [location.pathname]);

  const [pair, setPair] = useState<ITradingPairs | undefined>(undefined);

  //getting PAIRS DATA
  const pairsData = useGetCryptoPairs();
  const pairsArray = usePairList(pairsData?.pairs);

  const filteredList = useMemo(() => {
    const currencyList: ITradingPairs[] = []; //an Object with all possible pairs
    //making a currencyList with all possible pairs
    for (let pair of pairsArray) {
      //first here we push only RBTC pair
      currencyList.push([pair, pair]);
      currencyList.push([pair, pair, Asset.RBTC]); //adding RBTC as key for RBTC as source
      for (let pair2 of pairsArray) {
        if (pair.base_symbol !== pair2.base_symbol)
          // here we push to the currencyList all possible variants of currencies
          currencyList.push([pair, pair2]);
      }
    }

    return currencyList;
  }, [pairsArray]);

  useEffect(() => {
    if (Object.keys(selectedPair).length && !pair) {
      // set pairs from localStorage
      for (let item of filteredList) {
        if (selectedPair[2]) {
          if (
            tradingType[
              `${assetByTokenAddress(item[0].quote_id)}_${assetByTokenAddress(
                item[0].base_id,
              )}`
            ] === tradingType[`${selectedPair[0]}_${selectedPair[1]}`] &&
            tradingType[
              `${assetByTokenAddress(item[1].quote_id)}_${assetByTokenAddress(
                item[1].base_id,
              )}`
            ] === tradingType[`${selectedPair[0]}_${selectedPair[1]}`]
          ) {
            setPair(item);
          }
        } else {
          if (
            tradingType[
              `${assetByTokenAddress(item[0].base_id)}_${assetByTokenAddress(
                item[1].base_id,
              )}`
            ] === tradingType[`${selectedPair[0]}_${selectedPair[1]}`]
          ) {
            setPair(item);
          } else if (
            tradingType[
              `${assetByTokenAddress(item[0].base_id)}_${assetByTokenAddress(
                item[0].quote_id,
              )}`
            ] === tradingType[`${selectedPair[0]}_${selectedPair[1]}`] &&
            tradingType[
              `${assetByTokenAddress(item[1].base_id)}_${assetByTokenAddress(
                item[1].quote_id,
              )}`
            ] === tradingType[`${selectedPair[0]}_${selectedPair[1]}`] &&
            !item[2]
          ) {
            setPair(item);
          }
        }
      }
    } else if (!Object.keys(selectedPair).length && !pair) {
      // set SOV_RBTC by default
      for (let item of pairsArray) {
        if (
          `${assetByTokenAddress(item.base_id)}_${assetByTokenAddress(
            item.quote_id,
          )}` === tradingType.SOV_RBTC
        ) {
          setPair([item, item]);
        }
      }
    }
  }, [selectedPair, filteredList, tradingType, pair, pairsArray]);

  const dispatchAction = useCallback(
    pair => {
      if (type === TradingType.SPOT) {
        dispatch(spotActions.setPairType(pair));
      } else {
        dispatch(marginActions.setPairType(pair));
      }
    },
    [dispatch, type],
  );

  const onPairChange = useCallback(
    pair => {
      setPair(pair);
      if (pair[1] !== pair[0]) {
        reactLocalStorage.setObject(localStoreObject, [
          assetByTokenAddress(pair[0].base_id),
          assetByTokenAddress(pair[1].base_id),
        ]);
        dispatchAction(
          tradingType[
            `${assetByTokenAddress(pair[0].base_id)}_${assetByTokenAddress(
              pair[1].base_id,
            )}`
          ],
        );
      }
      //filtering pairs for RBTC as target
      if (pair[0].base_symbol === pair[1].base_symbol && !pair[2]) {
        reactLocalStorage.setObject(localStoreObject, [
          assetByTokenAddress(pair[0].base_id),
          assetByTokenAddress(pair[1].quote_id),
        ]);
        dispatchAction(
          tradingType[
            `${assetByTokenAddress(pair[0].base_id)}_${assetByTokenAddress(
              pair[0].quote_id,
            )}`
          ],
        );
      }
      //filtering pairs for RBTC as source
      if (pair[0].base_symbol === pair[1].base_symbol && pair[2]) {
        reactLocalStorage.setObject(localStoreObject, [
          assetByTokenAddress(pair[0].quote_id),
          assetByTokenAddress(pair[1].base_id),
          pair[2],
        ]);
        dispatchAction(
          tradingType[
            `${assetByTokenAddress(pair[0].quote_id)}_${assetByTokenAddress(
              pair[0].base_id,
            )}`
          ],
        );
      }
      setIsOpen(false);
    },
    [localStoreObject, dispatchAction, tradingType],
  );

  useEffect(() => {
    if (Object.keys(selectedPair).length) {
      dispatchAction(tradingType[`${selectedPair[0]}_${selectedPair[1]}`]);
    }
  }, [selectedPair, tradingType, dispatchAction]);

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container">
        <PairSelect
          storageKey={storageKey}
          onPairChange={onPairChange}
          pairsData={pairsData}
          type={type}
          isOpen={isOpen}
          onPairClick={() => setIsOpen(value => !value)}
        />

        {pair && <PairNavbarInfo pair={pair} />}
      </div>
    </div>
  );
};

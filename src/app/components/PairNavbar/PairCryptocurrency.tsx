import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { IPairData, ITradingPairs, TradingType } from 'types/trading-pairs';
import { getFavoriteList, setFavoriteList } from 'utils/helpers';
import { SpotPairType } from 'app/pages/SpotTradingPage/types';
import {
  TradingPairDictionary,
  TradingPairType,
} from 'utils/dictionaries/trading-pair-dictionary';
import { toNumberFormat } from 'utils/display-text/format';
import { Pair } from './Pair';
import { StarButton } from 'app/components/StarButton';
import { actions as spotActions } from 'app/pages/SpotTradingPage/slice';
import { actions as marginActions } from 'app/pages/MarginTradePage/slice';
import { usePairList } from 'app/hooks/trading/usePairList';
import { Asset } from 'types';

const FAVORITE = 'FAVORITE';

interface IPairCryptocurrencyProps {
  closePairList: () => void;
  storageKey: string;
  category: string;
  search: string;
  pairs: IPairData[];
  onPairChange: (value: [ITradingPairs]) => void;
  type: string;
}

export const PairCryptocurrency: React.FC<IPairCryptocurrencyProps> = ({
  closePairList,
  storageKey,
  category,
  search,
  pairs,
  onPairChange,
  type,
}) => {
  const { t } = useTranslation();
  const list = usePairList(pairs);
  const [favList, setFavList] = useState(getFavoriteList(storageKey));
  const dispatch = useDispatch();
  const dispatchAction: any =
    type === TradingType.SPOT ? spotActions : marginActions;
  const tradingType =
    type === TradingType.SPOT ? SpotPairType : TradingPairType;

  const handleFavClick = useCallback(
    pair => {
      const index = favList.findIndex(
        (favorite: ITradingPairs) =>
          (favorite[0].trading_pairs === pair[0].trading_pairs &&
            favorite[1].trading_pairs === pair[1].trading_pairs &&
            pair[2] === favorite[2]) ||
          (favorite[0].trading_pairs === pair[0].trading_pairs &&
            favorite[1].trading_pairs === pair[1].trading_pairs &&
            !pair[2] &&
            !favorite[2]),
      );
      const list = [...favList];
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(pair);
      }
      setFavList(list);
    },
    [favList],
  );

  const tradingPairs = TradingPairDictionary.entries()
    .filter(value => !value[1].deprecated)
    .map(([type]) => type);

  const filteredList = useMemo(() => {
    const currencyList: ITradingPairs[] = []; //an Object with all possible pairs
    //making a currencyList with all possible pairs
    for (let pair of list) {
      //first here we push only RBTC pair
      currencyList.push([pair, pair]);
      currencyList.push([pair, pair, Asset.RBTC]); //adding RBTC as key for RBTC as source
      for (let pair2 of list) {
        if (pair.base_symbol !== pair2.base_symbol)
          // here we push to the currencyList all possible variants of currencies
          currencyList.push([pair, pair2]);
      }
    }

    const currencyListFiltered = currencyList.filter((pair: ITradingPairs) => {
      if (type === TradingType.SPOT) {
        return pair;
      } else {
        if (
          tradingPairs.includes(
            TradingPairType[`${pair[0].base_symbol}_${pair[1].quote_symbol}`],
          ) ||
          tradingPairs.includes(
            TradingPairType[`${pair[0].quote_symbol}_${pair[1].base_symbol}`],
          )
        ) {
          return pair;
        }
      }
      return null;
    });

    return category === FAVORITE
      ? favList
      : currencyListFiltered.filter(item => {
          let searchAsset = search;
          if (searchAsset.toLowerCase() === 'eths') {
            searchAsset = Asset.ETH;
          } else if (searchAsset.toLowerCase() === 'bnbs') {
            searchAsset = Asset.BNB;
          }

          if (search.length && category && category !== Asset.RBTC) {
            return (
              (item[0].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].base_symbol.includes(category)) ||
              (item[1].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[1].base_symbol.includes(category)) ||
              (item[0].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].quote_symbol.includes(category)) ||
              (item[1].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[1].quote_symbol.includes(category)) ||
              (item[0].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[1].base_symbol.includes(category)) ||
              (item[1].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].base_symbol.includes(category)) ||
              (item[0].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[1].quote_symbol.includes(category)) ||
              (item[1].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].quote_symbol.includes(category)) ||
              (item[0].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].base_symbol.includes(category) &&
                item[0].base_symbol === item[1].base_symbol)
            );
          }
          if (
            category === Asset.RBTC &&
            item[0].base_symbol === item[1].base_symbol
          ) {
            return (
              (item[0].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].quote_symbol.includes(category)) ||
              (item[0].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].base_symbol.includes(category)) ||
              (item[0].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].quote_symbol.includes(category))
            );
          }
          if (item[0].base_symbol !== item[1].base_symbol) {
            //filtering pairs without RBTC as a source pair
            return (
              (item[0].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].base_symbol.includes(category)) ||
              (item[1].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[1].base_symbol.includes(category))
            );
          }
          if (item[0].base_symbol === item[1].base_symbol) {
            //filtering pairs only for RBTC as target
            return (
              (item[0].base_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].base_symbol.includes(category)) ||
              (item[0].quote_symbol.includes(searchAsset.toUpperCase()) &&
                item[0].quote_symbol.includes(category))
            );
          }
          return false;
        });
  }, [category, favList, search, list, tradingPairs, type]);

  useEffect(() => {
    setFavoriteList(storageKey, favList);
  }, [storageKey, favList]);

  const selectPair = useCallback(
    pair => {
      //filtering pairs without RBTC
      if (pair[1] !== pair[0])
        dispatch(
          dispatchAction.setPairType(
            tradingType[`${pair[0].base_symbol}_${pair[1].base_symbol}`],
          ),
        );
      //filtering pairs for RBTC as target
      if (pair[0].base_symbol === pair[1].base_symbol && !pair[2])
        dispatch(
          dispatchAction.setPairType(
            tradingType[`${pair[0].base_symbol}_${pair[0].quote_symbol}`],
          ),
        );
      //filtering pairs for RBTC as source
      if (pair[0].base_symbol === pair[1].base_symbol && pair[2])
        dispatch(
          dispatchAction.setPairType(
            tradingType[`${pair[0].quote_symbol}_${pair[0].base_symbol}`],
          ),
        );
      onPairChange(pair);
      closePairList();
    },
    [closePairList, dispatch, onPairChange, dispatchAction, tradingType],
  );

  const isFavoriteActive = (
    pair0: IPairData,
    pair1: IPairData,
    RBTC_source: string,
  ) =>
    favList.some(
      (favorite: ITradingPairs) =>
        (favorite[0].trading_pairs === pair0.trading_pairs &&
          favorite[1].trading_pairs === pair1.trading_pairs &&
          RBTC_source === favorite[2]) ||
        (favorite[0].trading_pairs === pair0.trading_pairs &&
          favorite[1].trading_pairs === pair1.trading_pairs &&
          !RBTC_source &&
          !favorite[2]),
    );

  const getLastPrice = (
    pair0: IPairData,
    pair1: IPairData,
    RBTC_source: string,
  ) => {
    //generating lastPrice for all pairs
    let lastPrice = 0;
    //for pairs without RBTC
    if (pair1 !== pair0) {
      lastPrice = pair0.last_price / pair1.last_price;
    }
    //for pairs with RBTC as source
    if (RBTC_source) {
      lastPrice = 1 / pair0.last_price;
    }
    //for pairs with RBTC as target
    if (pair0.base_symbol === pair1.base_symbol && !RBTC_source) {
      lastPrice = pair0.last_price;
    }
    return lastPrice;
  };

  const getDayPrice = (
    pair0: IPairData,
    pair1: IPairData,
    RBTC_source: string,
  ) => {
    //generating dayPrice for all pairs
    let dayPrice = 0;
    //for pairs without RBTC
    if (pair1 !== pair0) {
      dayPrice = pair0.day_price / pair1.day_price;
    }
    //for pairs with RBTC as source
    if (RBTC_source) {
      dayPrice = 1 / pair0.day_price;
    }
    //for pairs with RBTC as target
    if (pair0.base_symbol === pair1.base_symbol && !RBTC_source) {
      dayPrice = pair0.day_price;
    }
    return dayPrice;
  };

  const getPercent = (
    pair0: IPairData,
    pair1: IPairData,
    RBTC_source: string,
  ) => {
    const lastPrice = getLastPrice(pair0, pair1, RBTC_source);
    const dayPrice = getDayPrice(pair0, pair1, RBTC_source);
    //generating dayPrice for all pairs
    let percent = 0;
    //for pairs without RBTC
    if (pair1 !== pair0) {
      if (lastPrice > dayPrice) {
        percent = ((lastPrice - dayPrice) / dayPrice) * 100;
      } else if (lastPrice < dayPrice) {
        percent = ((lastPrice - dayPrice) / lastPrice) * 100;
      }
    }
    //for pairs with RBTC as target
    if (pair0.base_symbol === pair1.base_symbol && !RBTC_source) {
      percent = pair0.price_change_percent_24h;
    }
    return percent;
  };

  const isValidPair = (
    pair0: IPairData,
    pair1: IPairData,
    RBTC_source: string,
  ) => {
    let isValidPair = false; // checking tradingPair, if the pair exists
    if (
      pair0.base_symbol === pair1.base_symbol &&
      !RBTC_source &&
      tradingType[`${pair0.base_symbol}_${pair0.quote_symbol}`]
    ) {
      isValidPair = true;
    }
    if (
      pair0.base_symbol === pair1.base_symbol &&
      RBTC_source &&
      tradingType[`${pair0.quote_symbol}_${pair0.base_symbol}`]
    ) {
      isValidPair = true;
    }
    if (
      tradingType[`${pair0.base_symbol}_${pair1.base_symbol}`] &&
      !RBTC_source
    ) {
      isValidPair = true;
    }
    return isValidPair;
  };

  if (!list.length) {
    return null;
  }

  return (
    <div className="tw-max-h-96 tw-overflow-auto tw-w-full">
      <table className="tw-w-full">
        <thead>
          <tr>
            <td className="tw-w-8"></td>
            <td>{t(translations.pairNavbar.pair)}</td>
            <td className="tw-text-right">
              {t(translations.pairNavbar.lastTradedPrice)}
            </td>
            <td className="tw-text-right tw-pr-5">
              {t(translations.pairNavbar.dayChange)}
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((pair: ITradingPairs) => {
            if (!isValidPair(pair[0], pair[1], pair[2])) {
              return null;
            }
            return (
              <tr
                key={pair[0].base_id + pair[1].base_id + pair[2]}
                className="tw-text-sm tw-cursor-pointer tw-transition-opacity hover:tw-opacity-75"
              >
                <td>
                  <StarButton
                    active={isFavoriteActive(pair[0], pair[1], pair[2])}
                    onClick={() => handleFavClick(pair)}
                  />
                </td>
                <td className="tw-py-2" onClick={() => selectPair(pair)}>
                  {/* pairs with RBTC as target*/}
                  {pair[0].base_symbol === pair[1].base_symbol &&
                    !pair[2] &&
                    tradingType[
                      `${pair[0].base_symbol}_${pair[0].quote_symbol}`
                    ] && (
                      <Pair
                        type={type}
                        tradingType={
                          tradingType[
                            `${pair[0].base_symbol}_${pair[0].quote_symbol}`
                          ]
                        }
                      />
                    )}

                  {/* pairs with RBTC as source */}
                  {pair[0].base_symbol === pair[1].base_symbol &&
                    pair[2] &&
                    tradingType[
                      `${pair[0].quote_symbol}_${pair[0].base_symbol}`
                    ] && (
                      <Pair
                        type={type}
                        tradingType={
                          tradingType[
                            `${pair[0].quote_symbol}_${pair[0].base_symbol}`
                          ]
                        }
                      />
                    )}

                  {/* pairs without RBTC */}
                  {tradingType[
                    `${pair[0].base_symbol}_${pair[1].base_symbol}`
                  ] &&
                    !pair[2] && (
                      <Pair
                        type={type}
                        tradingType={
                          tradingType[
                            `${pair[0].base_symbol}_${pair[1].base_symbol}`
                          ]
                        }
                      />
                    )}
                </td>
                <td className="tw-text-right" onClick={() => selectPair(pair)}>
                  {toNumberFormat(getLastPrice(pair[0], pair[1], pair[2]), 6)}
                </td>
                <td
                  className={classNames('tw-text-right tw-pr-5', {
                    'tw-text-trade-long':
                      getPercent(pair[0], pair[1], pair[2]) > 0,
                    'tw-text-trade-short':
                      getPercent(pair[0], pair[1], pair[2]) < 0,
                  })}
                  onClick={() => selectPair(pair)}
                >
                  {getPercent(pair[0], pair[1], pair[2]) > 0 && <>+</>}
                  {toNumberFormat(
                    getPercent(pair[0], pair[1], pair[2]),
                    getPercent(pair[0], pair[1], pair[2]) !== 0 ? 6 : 0,
                  )}
                  %
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

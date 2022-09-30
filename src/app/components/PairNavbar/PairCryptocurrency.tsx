import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
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
import { usePairList } from 'app/hooks/trading/usePairList';
import { Asset } from 'types';
import { getLastPrice } from './utils';
import { RenderPercentageColumn } from './RenderPercentageColumn';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';

const FAVORITE = 'FAVORITE';

interface IPairCryptocurrencyProps {
  storageKey: string;
  category: string;
  search: string;
  pairs: IPairData[];
  onPairChange: (value: ITradingPairs) => void;
  type: string;
}

export const PairCryptocurrency: React.FC<IPairCryptocurrencyProps> = ({
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
            TradingPairType[
              `${assetByTokenAddress(pair[0].base_id)}_${assetByTokenAddress(
                pair[1].quote_id,
              )}`
            ],
          ) ||
          tradingPairs.includes(
            TradingPairType[
              `${assetByTokenAddress(pair[0].quote_id)}_${assetByTokenAddress(
                pair[1].base_id,
              )}`
            ],
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

          const baseSymbol0 = assetByTokenAddress(item[0].base_id);
          const baseSymbol1 = assetByTokenAddress(item[1].base_id);
          const quoteSymbol0 = assetByTokenAddress(item[0].quote_id);
          const quoteSymbol1 = assetByTokenAddress(item[1].quote_id);

          if (!baseSymbol0 || !baseSymbol1 || !quoteSymbol0 || !quoteSymbol1) {
            return false;
          }

          if (search.length && category && category !== Asset.RBTC) {
            return (
              (baseSymbol0.includes(searchAsset.toUpperCase()) &&
                baseSymbol0.includes(category)) ||
              (baseSymbol1.includes(searchAsset.toUpperCase()) &&
                baseSymbol1.includes(category)) ||
              (quoteSymbol0.includes(searchAsset.toUpperCase()) &&
                quoteSymbol0.includes(category)) ||
              (quoteSymbol1.includes(searchAsset.toUpperCase()) &&
                quoteSymbol1.includes(category)) ||
              (baseSymbol0.includes(searchAsset.toUpperCase()) &&
                baseSymbol1.includes(category)) ||
              (baseSymbol1.includes(searchAsset.toUpperCase()) &&
                baseSymbol0.includes(category)) ||
              (quoteSymbol0.includes(searchAsset.toUpperCase()) &&
                quoteSymbol1.includes(category)) ||
              (quoteSymbol1.includes(searchAsset.toUpperCase()) &&
                quoteSymbol0.includes(category)) ||
              (quoteSymbol0.includes(searchAsset.toUpperCase()) &&
                baseSymbol0.includes(category) &&
                baseSymbol0 === baseSymbol1)
            );
          }
          if (category === Asset.RBTC && baseSymbol0 === baseSymbol1) {
            return (
              (baseSymbol0.includes(searchAsset.toUpperCase()) &&
                quoteSymbol0.includes(category)) ||
              (quoteSymbol0.includes(searchAsset.toUpperCase()) &&
                baseSymbol0.includes(category)) ||
              (quoteSymbol0.includes(searchAsset.toUpperCase()) &&
                quoteSymbol0.includes(category))
            );
          }
          if (baseSymbol0 !== baseSymbol1) {
            //filtering pairs without RBTC as a source pair
            return (
              (baseSymbol0.includes(searchAsset.toUpperCase()) &&
                baseSymbol0.includes(category)) ||
              (baseSymbol1.includes(searchAsset.toUpperCase()) &&
                baseSymbol1.includes(category))
            );
          }
          if (baseSymbol0 === baseSymbol1) {
            //filtering pairs only for RBTC as target
            return (
              (baseSymbol0.includes(searchAsset.toUpperCase()) &&
                baseSymbol0.includes(category)) ||
              (quoteSymbol0.includes(searchAsset.toUpperCase()) &&
                quoteSymbol0.includes(category))
            );
          }
          return false;
        });
  }, [category, favList, search, list, tradingPairs, type]);

  useEffect(() => {
    setFavoriteList(storageKey, favList);
  }, [storageKey, favList]);

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

  const isValidPair = (
    pair0: IPairData,
    pair1: IPairData,
    RBTC_source: string,
  ) => {
    let isValidPair = false; // checking tradingPair, if the pair exists
    if (
      pair0.base_id === pair1.base_id &&
      !RBTC_source &&
      tradingType[
        `${assetByTokenAddress(pair0.base_id)}_${assetByTokenAddress(
          pair0.quote_id,
        )}`
      ]
    ) {
      isValidPair = true;
    }
    if (
      pair0.base_id === pair1.base_id &&
      RBTC_source &&
      tradingType[
        `${assetByTokenAddress(pair0.quote_id)}_${assetByTokenAddress(
          pair0.base_id,
        )}`
      ]
    ) {
      isValidPair = true;
    }
    if (
      tradingType[
        `${assetByTokenAddress(pair0.base_id)}_${assetByTokenAddress(
          pair1.base_id,
        )}`
      ] &&
      !RBTC_source
    ) {
      isValidPair = true;
    }
    return isValidPair;
  };

  const pairTradingType = useCallback(
    (pair: ITradingPairs) => {
      /* pairs with RBTC as target*/
      if (
        pair[0].base_symbol === pair[1].base_symbol &&
        !pair[2] &&
        tradingType[
          `${assetByTokenAddress(pair[0].base_id)}_${assetByTokenAddress(
            pair[0].quote_id,
          )}`
        ]
      ) {
        return tradingType[
          `${assetByTokenAddress(pair[0].base_id)}_${assetByTokenAddress(
            pair[0].quote_id,
          )}`
        ];
      }
      /* pairs with RBTC as source */
      if (
        pair[0].base_symbol === pair[1].base_symbol &&
        pair[2] &&
        tradingType[
          `${assetByTokenAddress(pair[0].quote_id)}_${assetByTokenAddress(
            pair[0].base_id,
          )}`
        ]
      ) {
        return tradingType[
          `${assetByTokenAddress(pair[0].quote_id)}_${assetByTokenAddress(
            pair[0].base_id,
          )}`
        ];
      }
      /* pairs without RBTC*/
      if (
        tradingType[
          `${assetByTokenAddress(pair[0].base_id)}_${assetByTokenAddress(
            pair[1].base_id,
          )}`
        ] &&
        !pair[2]
      ) {
        return tradingType[
          `${assetByTokenAddress(pair[0].base_id)}_${assetByTokenAddress(
            pair[1].base_id,
          )}`
        ];
      }
    },
    [tradingType],
  );

  if (!list.length) {
    return null;
  }

  return (
    <div className="tw-max-h-96 tw-overflow-auto tw-w-full">
      <table className="tw-w-full tw-table-fixed">
        <thead className="tw-sticky tw-top-0 tw-bg-gray-2 tw-z-20">
          <tr>
            <th className="tw-w-8"></th>
            <th>{t(translations.pairNavbar.pair)}</th>
            <th className="tw-text-right">
              {t(translations.pairNavbar.lastTradedPrice)}
            </th>
            <th className="tw-text-right tw-pr-5">
              {t(translations.pairNavbar.dayChange)}
            </th>
          </tr>
        </thead>
        <tbody className="tw-overflow-auto tw-d-block">
          {filteredList.map((pair: ITradingPairs) => {
            if (!isValidPair(pair[0], pair[1], pair[2])) {
              return null;
            }
            return (
              <tr
                key={pair[0].base_id + pair[1].base_id + pair[2]}
                className="tw-text-sm tw-cursor-pointer tw-transition-opacity hover:tw-opacity-75 tw-d-table tw-table-fixed"
                data-action-id={`${type}-pairSelector-${pairTradingType(pair)}`}
              >
                <td>
                  <StarButton
                    active={isFavoriteActive(pair[0], pair[1], pair[2])}
                    onClick={() => handleFavClick(pair)}
                  />
                </td>
                <td className="tw-py-2" onClick={() => onPairChange(pair)}>
                  <Pair type={type} tradingType={pairTradingType(pair)} />
                </td>
                <td
                  className="tw-text-right"
                  onClick={() => onPairChange(pair)}
                >
                  {toNumberFormat(getLastPrice(pair[0], pair[1], pair[2]), 8)}
                </td>
                <RenderPercentageColumn
                  pair={pair}
                  onPairChange={onPairChange}
                />
              </tr>
            );
          })}
          {filteredList.length === 0 && (
            <tr>
              <td className="tw-text-center tw-pt-4" colSpan={4}>
                {t(translations.common.noData)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

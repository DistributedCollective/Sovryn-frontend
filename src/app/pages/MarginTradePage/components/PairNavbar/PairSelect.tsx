import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { Input } from 'app/components/Form/Input';
import {
  IPairs,
  IPairsData,
} from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import { getFavoriteList, setFavoriteList } from 'utils/helpers';
import { selectMarginTradePage } from '../../selectors';
import { TradingPairs } from '../../types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { toNumberFormat } from 'utils/display-text/format';
import { Pair } from './Pair';
import { PairLabels } from './PairLabels';
import { StarButton } from 'app/components/StarButton';
import { actions } from '../../slice';
import useOnClickOutside from 'app/hooks/useOnClickOutside';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';
import styles from './index.module.scss';

const FAVORITE = 'FAVORITE';

interface IPairSelect {
  onPairChange: ([TradingPairs]) => void;
  storageKey: string;
  pairsData: IPairsData;
}

export const PairSelect: React.FC<IPairSelect> = ({
  storageKey,
  onPairChange,
  pairsData,
}) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { pairType } = useSelector(selectMarginTradePage);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="tw-relative tw-w-64">
      <div
        onClick={() => setOpen(!open)}
        className="tw-flex tw-items-center tw-py-1 tw-bg-gray-2 tw-px-8 tw-rounded-lg tw-cursor-pointer tw-select-none tw-transition-opacity hover:tw-bg-opacity-75"
      >
        <div className="tw-flex-1">
          <Pair pairType={pairType} />
        </div>
        <img
          className={cn('tw-w-5 tw-transition-transform ', {
            'tw-transform tw-rotate-180': open,
          })}
          src={arrowDownIcon}
          alt="Arrow"
        />
      </div>
      {open && (
        <div
          className={cn(
            'tw-absolute tw-transform tw-translate-y-full tw-bottom-0 tw-left-0 tw-bg-gray-2 tw-py-7 tw-px-9 tw-rounded-b-lg tw-z-50',
            styles.pairsModal,
          )}
        >
          <Input
            value={search}
            className={cn('tw-rounded-lg', styles.search)}
            inputClassName="tw-ml-0"
            onChange={setSearch}
            placeholder={t(translations.spotTradingPage.pairNavbar.search)}
            prependElem={
              <img className="tw-w-5" src={arrowDownIcon} alt="Arrow" />
            }
          />

          <div className="tw-flex tw-items-center tw-mt-3">
            <StarButton
              className="tw-mr-4"
              active={category === FAVORITE}
              onClick={() => setCategory(FAVORITE)}
            />
            {pairsData && (
              <PairLabels
                pairs={pairsData.pairs}
                onChangeCategory={e => setCategory(e)}
                category={category}
              />
            )}
          </div>
          {pairsData && (
            <div className="tw-mt-3">
              <CryptocurrencyPairs
                pairs={pairsData.pairs}
                storageKey={storageKey}
                category={category}
                search={search}
                closePairList={() => setOpen(false)}
                onPairChange={onPairChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ICryptocurrencyPairsProps {
  closePairList: () => void;
  storageKey: string;
  category: string;
  search: string;
  pairs: IPairs;
  onPairChange: (value: [TradingPairs]) => void;
}

export const CryptocurrencyPairs: React.FC<ICryptocurrencyPairsProps> = ({
  closePairList,
  storageKey,
  category,
  search,
  pairs,
  onPairChange,
}) => {
  const { t } = useTranslation();
  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs)
      .map(key => pairs[key])
      .filter(pair => pair);
  }, [pairs]);

  const [favList, setFavList] = useState(getFavoriteList(storageKey));
  const dispatch = useDispatch();

  const handleFavClick = useCallback(
    pair => {
      const index = favList.findIndex(
        (favorite: TradingPairs) =>
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

  const filteredList = useMemo(() => {
    const currencyList: [TradingPairs] = [] as any; //an Object with all possible pairs
    //making a currencyList with all possible pairs
    for (let i = 0; i < list.length; i++) {
      //first here we push only RBTC pair
      currencyList.push([list[i], list[i]]);
      currencyList.push([list[i], list[i], 'RBTC']); //adding RBTC as key for RBTC as source
      for (let j = 0; j < list.length; j++) {
        if (list[i].base_symbol !== list[j].base_symbol)
          //here we push to the currencyList all posible variants of currencies
          currencyList.push([list[i], list[j]]);
      }
    }

    return category === FAVORITE
      ? favList
      : currencyList.filter(item => {
          //filtering this list according to TradingPairType
          if (
            (TradingPairType[item[0].base_symbol + '_' + item[1].base_symbol] &&
              !item[2]) ||
            (TradingPairType[
              item[0].quote_symbol + '_' + item[0].base_symbol
            ] &&
              item[2]) ||
            (item[0].base_symbol === item[1].base_symbol &&
              !item[2] &&
              TradingPairType[item[0].trading_pairs])
          ) {
            return (
              (item[0].base_symbol.includes(search.toUpperCase()) &&
                item[0].base_symbol.includes(category)) ||
              (item[1].base_symbol.includes(search.toUpperCase()) &&
                item[0].base_symbol.includes(category))
            );
          }
          return false;
        });
  }, [category, favList, search, list]);

  useEffect(() => {
    setFavoriteList(storageKey, favList);
  }, [storageKey, favList]);

  const selectPair = useCallback(
    pair => {
      //filtering pairs without RBTC
      if (pair[1] !== pair[0])
        dispatch(
          actions.setPairType(
            TradingPairType[pair[0].base_symbol + '_' + pair[1].base_symbol],
          ),
        );
      //filtering pairs for RBTC as target
      if (pair[0].base_symbol === pair[1].base_symbol && !pair[2])
        dispatch(
          actions.setPairType(
            TradingPairType[pair[0].base_symbol + '_' + pair[0].quote_symbol],
          ),
        );
      //filtering pairs for RBTC as source
      if (pair[0].base_symbol === pair[1].base_symbol && pair[2])
        dispatch(
          actions.setPairType(
            TradingPairType[pair[0].quote_symbol + '_' + pair[0].base_symbol],
          ),
        );
      onPairChange(pair);
      closePairList();
    },
    [closePairList, dispatch, onPairChange],
  );

  if (!list.length) return null;

  return (
    <div className="tw-max-h-96 tw-overflow-auto tw-w-full">
      <table className="tw-w-full">
        <thead>
          <tr>
            <td className="tw-w-8"></td>
            <td>{t(translations.spotTradingPage.pairNavbar.pair)}</td>
            <td className="tw-text-right">
              {t(translations.spotTradingPage.pairNavbar.lastTradedPrice)}
            </td>
            <td className="tw-text-right tw-pr-5">
              {t(translations.spotTradingPage.pairNavbar.dayChange)}
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((pair: TradingPairs) => {
            //generating lastPrice for all pairs
            let lastPrice = 0;
            //for pairs without RBTC
            if (pair[1] !== pair[0])
              lastPrice = pair[0].last_price / pair[1].last_price;
            //for pairs with RBTC as source
            if (pair[2]) lastPrice = 1 / pair[0].last_price;
            //for pairs with RBTC as target
            if (pair[0].base_symbol === pair[1].base_symbol && !pair[2])
              lastPrice = pair[0].last_price;

            //generating dayPrice for all pairs
            let dayPrice = 0;
            //for pairs without RBTC
            if (pair[1] !== pair[0])
              dayPrice = pair[0].day_price / pair[1].day_price;
            //for pairs with RBTC as source
            if (pair[2]) dayPrice = 1 / pair[0].day_price;
            //for pairs with RBTC as target
            if (pair[0].base_symbol === pair[1].base_symbol && !pair[2])
              dayPrice = pair[0].day_price;

            //generating dayPrice for all pairs
            let percent = 0;
            //for pairs without RBTC
            if (pair[1] !== pair[0])
              if (lastPrice > dayPrice)
                percent = ((lastPrice - dayPrice) / dayPrice) * 100;
              else if (lastPrice < dayPrice)
                percent = ((lastPrice - dayPrice) / lastPrice) * 100;
            //for pairs with RBTC as source
            if (pair[2]) percent = -pair[0].price_change_percent_24h;
            //for pairs with RBTC as target
            if (pair[0].base_symbol === pair[1].base_symbol && !pair[2])
              percent = pair[0].price_change_percent_24h;

            const isFavoriteActive = favList.some(
              (favorite: TradingPairs) =>
                (favorite[0].trading_pairs === pair[0].trading_pairs &&
                  favorite[1].trading_pairs === pair[1].trading_pairs &&
                  pair[2] === favorite[2]) ||
                (favorite[0].trading_pairs === pair[0].trading_pairs &&
                  favorite[1].trading_pairs === pair[1].trading_pairs &&
                  !pair[2] &&
                  !favorite[2]),
            );
            return (
              <tr
                key={pair[0].base_id + pair[1].base_id + pair[2]}
                className="tw-text-sm tw-cursor-pointer tw-transition-opacity hover:tw-opacity-75"
              >
                <td>
                  <StarButton
                    active={isFavoriteActive}
                    onClick={() => handleFavClick(pair)}
                  />
                </td>
                <td className="tw-py-2" onClick={() => selectPair(pair)}>
                  {/* pairs without RBTC */}
                  {pair[1] !== pair[0] && (
                    <Pair
                      pairType={
                        TradingPairType[
                          pair[0].base_symbol + '_' + pair[1].base_symbol
                        ]
                      }
                    />
                  )}
                  {/* pairs with RBTC as target */}
                  {pair[0].base_symbol === pair[1].base_symbol && !pair[2] && (
                    <Pair
                      pairType={
                        TradingPairType[
                          pair[0].base_symbol + '_' + pair[0].quote_symbol
                        ]
                      }
                    />
                  )}
                  {/* pairs with RBTC as source */}
                  {pair[2] && (
                    <Pair
                      pairType={
                        TradingPairType[
                          pair[0].quote_symbol + '_' + pair[0].base_symbol
                        ]
                      }
                    />
                  )}
                </td>
                <td className="tw-text-right" onClick={() => selectPair(pair)}>
                  {toNumberFormat(lastPrice, 6)}
                </td>
                <td
                  className={cn('tw-text-right tw-pr-5', {
                    'tw-text-trade-long': percent > 0,
                    'tw-text-trade-short': percent < 0,
                  })}
                  onClick={() => selectPair(pair)}
                >
                  {percent > 0 && <>+</>}
                  {toNumberFormat(percent, percent !== 0 ? 6 : 0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

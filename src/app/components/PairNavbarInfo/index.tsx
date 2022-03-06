import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toNumberFormat } from 'utils/display-text/format';
import { ITradingPairs } from 'types/trading-pairs';
import classNames from 'classnames';
import { LoadableValue } from 'app/components/LoadableValue';
import { useGetCandlesData } from 'app/hooks/trading/useGetCandlesData';

interface IPairNavbarInfoProps {
  pair: ITradingPairs;
}

export const PairNavbarInfo: React.FC<IPairNavbarInfoProps> = ({ pair }) => {
  const { t } = useTranslation();
  const [lowPrice, setLowPrice] = useState(0);
  const [hightPrice, setHightPrice] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [dayPrice, setDayPrice] = useState(0);
  const [percent, setPercent] = useState(0);
  const [symbolA, setSymbolA] = useState('');
  const [symbolB, setSymbolB] = useState('');
  const { candles, loading } = useGetCandlesData(symbolA, symbolB);

  useEffect(() => {
    setSymbolA(pair[0].base_symbol);
    setSymbolB(pair[1].base_symbol);
  }, [pair]);

  useEffect(() => {
    if (!loading && candles) {
      //generating lastPrice for all pairs
      // for pairs without RBTC
      if (pair[1] !== pair[0]) {
        setLastPrice(pair[0].last_price / pair[1].last_price);
      }
      //for pairs with RBTC as source
      if (pair[2]) {
        setLastPrice(1 / pair[0].last_price);
      }
      //for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2]) {
        setLastPrice(pair[0].last_price);
      }

      //generating dayPrice for all pairs
      //for pairs without RBTC
      if (pair[1] !== pair[0]) {
        setDayPrice(pair[0].day_price / pair[1].day_price);
      }
      //for pairs with RBTC as source
      if (pair[2]) {
        setDayPrice(1 / pair[0].day_price);
      }
      //for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2]) {
        setDayPrice(pair[0].day_price);
      }

      //generating percent for all pairs
      //for pairs without RBTC
      setPercent(0);
      if (pair[1] !== pair[0]) {
        if (lastPrice > dayPrice) {
          setPercent(((lastPrice - dayPrice) / dayPrice) * 100);
        } else if (lastPrice < dayPrice) {
          setPercent(((lastPrice - dayPrice) / lastPrice) * 100);
        }
      }
      //for pairs with RBTC as source
      if (pair[2]) {
        setPercent(
          pair[0].price_change_percent_24h !== 0
            ? -pair[0].price_change_percent_24h
            : pair[0].price_change_percent_24h,
        );
      }

      //for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2]) {
        setPercent(pair[0].price_change_percent_24h);
      }

      const sortedLowPrice = candles.sort((a, b) => {
        return a.low - b.low;
      });

      const sortedHightPrice = candles.sort((a, b) => {
        return b.high - a.high;
      });

      if (sortedLowPrice.length) {
        setLowPrice(sortedLowPrice[0].low);
      } else {
        // for pairs with RBTC as source
        if (pair[2]) {
          setLowPrice(1 / pair[0].high_price_24h);
        }
        // for pairs with RBTC as target
        if (pair[0] === pair[1] && !pair[2]) {
          setLowPrice(pair[0].lowest_price_24h);
        }
      }

      if (sortedHightPrice.length) {
        setHightPrice(sortedHightPrice[0].high);
      } else {
        // for pairs with RBTC as source
        if (pair[2]) {
          setHightPrice(1 / pair[0].lowest_price_24h);
        }
        // for pairs with RBTC as target
        if (pair[0] === pair[1] && !pair[2]) {
          setHightPrice(pair[0].high_price_24h);
        }
      }
    }
  }, [lastPrice, pair, candles, loading, dayPrice]);

  return (
    <div className="tw-flex tw-items-center tw-justify-around tw-flex-1 tw-text-xs">
      <div className="tw-hidden sm:tw-flex tw-items-center tw-text-center tw-flex-row">
        {t(translations.pairNavbar.lastTradedPrice)}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-primary">
          <LoadableValue
            value={toNumberFormat(lastPrice, 6)}
            loading={loading}
          />
        </span>
      </div>
      <div className="tw-hidden md:tw-flex tw-items-center tw-text-center tw-flex-row">
        {t(translations.pairNavbar.dayPercentChange)}{' '}
        <span
          className={classNames(
            'tw-ml-2 tw-font-semibold tw-text-sm tw-whitespace-nowrap',
            {
              'tw-text-trade-long': percent > 0,
              'tw-text-trade-short': percent < 0,
            },
          )}
        >
          {percent > 0 && <>+</>}
          <LoadableValue
            value={<>{toNumberFormat(percent, percent !== 0 ? 6 : 0)}%</>}
            loading={loading}
          />
        </span>
      </div>
      <div className="tw-hidden lg:tw-flex tw-items-center tw-text-center tw-flex-row">
        {t(translations.pairNavbar.dayLow)}{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-short">
          <LoadableValue
            value={toNumberFormat(lowPrice, 6)}
            loading={loading}
          />
        </span>
      </div>
      <div className="tw-hidden xl:tw-flex tw-items-center tw-text-center tw-flex-row">
        {t(translations.pairNavbar.dayHigh)}{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-long">
          <LoadableValue
            value={toNumberFormat(hightPrice, 6)}
            loading={loading}
          />
        </span>
      </div>
    </div>
  );
};

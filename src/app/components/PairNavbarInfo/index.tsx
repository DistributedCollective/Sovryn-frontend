import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toNumberFormat } from 'utils/display-text/format';
import { ITradingPairs } from 'types/trading-pairs';
import classNames from 'classnames';
import { watchPrice } from 'utils/pair-price-tracker';
import { Asset } from 'types';
import { getPercentageChange } from '../PairNavbar/utils';
import { bignumber } from 'mathjs';
import { shouldInvertPair } from '../TradingChart/helpers';

interface IPairNavbarInfoProps {
  pair: ITradingPairs;
}

const parsePairData = (
  pairData: ITradingPairs,
): {
  lastPrice: number;
  percentageChange: number;
  highPrice: number;
  lowPrice: number;
} => {
  let lastPrice = 0;
  let percentageChange = 0;
  let highPrice = 0;
  let lowPrice = 0;

  /** Special case for RBTC/XUSD pair - underlying AMM pool is XUSD/RBTC but we need to display the reverse */
  if (
    pairData[0].trading_pairs === pairData[1].trading_pairs &&
    pairData[1].base_symbol === Asset.XUSD
  ) {
    lastPrice = pairData[0].last_price;
    percentageChange = -pairData[0].price_change_percent_24h;
    lowPrice = Number(bignumber(1).div(pairData[0].high_price_24h).toFixed(18));
    highPrice = Number(bignumber(1).div(pairData[0].lowest_price_24h));
    return { highPrice, lowPrice, percentageChange, lastPrice };
  }

  /** BTC is quote symbol */
  if (pairData[0].trading_pairs === pairData[1].trading_pairs) {
    lastPrice = pairData[0].last_price;
    percentageChange = pairData[0].price_change_percent_24h;
    highPrice = pairData[0].high_price_24h;
    lowPrice = pairData[0].lowest_price_24h;
    return { highPrice, lowPrice, percentageChange, lastPrice };
  }

  lastPrice = pairData[0].last_price * (1 / pairData[1].last_price);
  percentageChange = getPercentageChange(
    lastPrice,
    pairData[0].day_price * (1 / pairData[1].day_price),
  );

  /** XUSD is quote symbol */
  if (pairData[1].base_symbol === Asset.XUSD) {
    highPrice = pairData[0].high_price_24h_usd;
    lowPrice = pairData[0].lowest_price_24h_usd;
    return { highPrice, lowPrice, percentageChange, lastPrice };
  }

  return { highPrice, lowPrice, percentageChange, lastPrice };
};

export const PairNavbarInfo: React.FC<IPairNavbarInfoProps> = ({ pair }) => {
  const { t } = useTranslation();
  const [lowPrice, setLowPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [lastPriceEvent, setLastPriceEvent] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const parsedData = parsePairData(pair);
    setLastPrice(parsedData.lastPrice);
    setPercent(parsedData.percentageChange);
    setHighPrice(parsedData.highPrice);
    setLowPrice(parsedData.lowPrice);
  }, [pair]);

  useEffect(() => {
    const symbol =
      pair[0].trading_pairs === pair[1].trading_pairs
        ? `${pair[0].quote_id}/${pair[0].base_id}`
        : `${pair[0].base_id}/${pair[1].base_id}`;
    setLastPriceEvent(0);
    const unsubscribe = watchPrice(symbol, val => {
      setLastPriceEvent(val);
    });
    return () => unsubscribe();
  }, [pair]);

  const invertPrice = useMemo(
    () =>
      shouldInvertPair(
        `${pair[0].base_symbol_legacy}/${pair[0].quote_symbol_legacy}`,
      ) ||
      shouldInvertPair(
        `${pair[0].quote_symbol_legacy}/${pair[0].base_symbol_legacy}`,
      ),
    [pair],
  );

  const _lastPrice = useMemo(() => lastPriceEvent || lastPrice, [
    lastPrice,
    lastPriceEvent,
  ]);

  const normalize = useCallback(
    (value: number) => {
      if (value && invertPrice) {
        return 1 / value;
      }
      return value;
    },
    [invertPrice],
  );

  const low = useMemo(() => normalize(invertPrice ? highPrice : lowPrice), [
    highPrice,
    invertPrice,
    lowPrice,
    normalize,
  ]);
  const high = useMemo(() => normalize(invertPrice ? lowPrice : highPrice), [
    highPrice,
    invertPrice,
    lowPrice,
    normalize,
  ]);

  return (
    <div className="tw-flex tw-items-center tw-justify-around tw-flex-1 tw-text-xs">
      <div className="tw-hidden sm:tw-flex tw-items-center tw-text-center tw-flex-row">
        {t(translations.pairNavbar.lastTradedPrice)}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-primary">
          {toNumberFormat(_lastPrice, 8)}
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
          <>{toNumberFormat(percent, percent !== 0 ? 6 : 0)}%</>
        </span>
      </div>

      <div className="tw-hidden lg:tw-flex tw-items-center tw-text-center tw-flex-row">
        {lowPrice > 0 && (
          <div>
            {t(translations.pairNavbar.dayLow)}
            <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-short">
              {toNumberFormat(low, 8)}
            </span>
          </div>
        )}{' '}
      </div>
      <div className="tw-hidden xl:tw-flex tw-items-center tw-text-center tw-flex-row">
        {highPrice > 0 && (
          <div>
            {t(translations.pairNavbar.dayHigh)}{' '}
            <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-long">
              {toNumberFormat(high, 8)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

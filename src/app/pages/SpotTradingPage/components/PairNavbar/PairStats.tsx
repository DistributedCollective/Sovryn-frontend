import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toNumberFormat } from 'utils/display-text/format';
import { TradingPairs } from '../../types';
import classNames from 'classnames';
import { backendUrl, currentChainId } from 'utils/classifiers';
import axios from 'axios';
import { LoadableValue } from 'app/components/LoadableValue';

interface IPairStatsProps {
  pair: TradingPairs;
}

export const PairStats: React.FC<IPairStatsProps> = ({ pair }) => {
  const { t } = useTranslation();
  const [candles, setCandels] = useState([]) as any;
  const [lowPrice, setLowPrice] = useState<number>(0);
  const [hightPrice, setHightPrice] = useState<number>(0);
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [dayPrice, setDayPrice] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [candlesLoading, setCandlesLoading] = useState(false);
  const [symbolA, setSymbolA] = useState('');
  const [symbolB, setSymbolB] = useState('');
  const lowestPrice = candles.sort(function (a, b) {
    return a.low - b.low;
  });
  const highestPrice = candles.sort(function (a, b) {
    return a.high - b.high;
  });

  const getPairsCandles = useCallback(() => {
    setCandlesLoading(true);
    //getting the current day and yesterday
    const dayBefore = new Date();
    const currentTime = new Date().getTime();
    dayBefore.setDate(dayBefore.getDate() - 1);
    const pairs_api = `${
      backendUrl[currentChainId]
    }/datafeed/price/${symbolA}:${symbolB}?startTime=${dayBefore.getTime()}&endTime=${currentTime}`;
    axios
      .get(pairs_api)
      .then(res => {
        setCandels(res.data.series);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setCandlesLoading(false);
      });
  }, [symbolA, symbolB]);

  useEffect(() => {
    setCandels(['']);
    setSymbolA(pair[0].base_symbol);
    setSymbolB(pair[1].base_symbol);
    if (pair[0] !== pair[1]) {
      getPairsCandles();
    }
  }, [getPairsCandles, pair]);

  useEffect(() => {
    if (!candlesLoading) {
      //generating lastPrice for all pairs
      // for pairs without RBTC
      if (pair[1] !== pair[0])
        setLastPrice(pair[0].last_price / pair[1].last_price);
      //for pairs with RBTC as source
      if (pair[2]) setLastPrice(1 / pair[0].last_price);
      //for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2]) setLastPrice(pair[0].last_price);

      //generating dayPrice for all pairs
      //for pairs without RBTC
      if (pair[1] !== pair[0])
        setDayPrice(pair[0].day_price / pair[1].day_price);
      //for pairs with RBTC as source
      if (pair[2]) setDayPrice(1 / pair[0].day_price);
      //for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2]) setDayPrice(pair[0].day_price);

      //generating dayPrice for all pairs
      //for pairs without RBTC
      if (pair[1] !== pair[0])
        if (lastPrice > dayPrice)
          setPercent(((lastPrice - dayPrice) / dayPrice) * 100);
        else if (lastPrice < dayPrice)
          setPercent(((lastPrice - dayPrice) / lastPrice) * 100);
      //for pairs with RBTC as source
      if (pair[2]) setPercent(-pair[0].price_change_percent_24h);
      //for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2])
        setPercent(pair[0].price_change_percent_24h);
      //generating lowPrice
      // for pairs with RBTC as source
      if (pair[2]) setLowPrice(1 / pair[0].high_price_24h);
      // for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2])
        setLowPrice(pair[0].lowest_price_24h);

      // generating hightPrice
      // for pairs with RBTC as source
      if (pair[2]) setHightPrice(1 / pair[0].lowest_price_24h);
      // for pairs with RBTC as target
      if (pair[0] === pair[1] && !pair[2])
        setHightPrice(pair[0].high_price_24h);
    }

    if (candles.length > 0 && pair[0] !== pair[1]) {
      setLowPrice(lowestPrice[0].low);
      setHightPrice(highestPrice[highestPrice.length - 1].high);
    }
  }, [
    lastPrice,
    pair,
    candlesLoading,
    candles,
    highestPrice,
    lowestPrice,
    dayPrice,
  ]);

  return (
    <div className="tw-flex tw-items-center tw-justify-around tw-flex-1 tw-py-2 tw-text-xs">
      <div className="tw-flex tw-items-center tw-text-center tw-flex-col lg:tw-flex-row">
        {t(translations.spotTradingPage.pairNavbar.lastTradedPrice)}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-primary">
          <LoadableValue
            value={toNumberFormat(lastPrice, 6)}
            loading={candlesLoading}
          />
        </span>
      </div>
      <div className="tw-flex tw-items-center tw-text-center tw-flex-col lg:tw-flex-row">
        {t(translations.spotTradingPage.pairNavbar.dayPercentChange)}{' '}
        <span
          className={classNames('tw-ml-2 tw-font-semibold tw-text-sm', {
            'tw-text-trade-long': percent > 0,
            'tw-text-trade-short': percent < 0,
          })}
        >
          {percent > 0 && <>+</>}
          <LoadableValue
            value={<>{toNumberFormat(percent, percent !== 0 ? 6 : 0)}%</>}
            loading={candlesLoading}
          />
        </span>
      </div>

      <div className="tw-flex tw-items-center tw-text-center tw-flex-col lg:tw-flex-row">
        {t(translations.spotTradingPage.pairNavbar.dayLow)}{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-short">
          <LoadableValue
            value={toNumberFormat(lowPrice, 6)}
            loading={candlesLoading}
          />
        </span>
      </div>
      <div className="tw-flex tw-items-center tw-text-center tw-flex-col lg:tw-flex-row">
        {t(translations.spotTradingPage.pairNavbar.dayHigh)}{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-long">
          <LoadableValue
            value={toNumberFormat(hightPrice, 6)}
            loading={candlesLoading}
          />
        </span>
      </div>
    </div>
  );
};

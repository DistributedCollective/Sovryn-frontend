import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toNumberFormat } from 'utils/display-text/format';
import { ITradingPairs } from 'types/trading-pairs';
import classNames from 'classnames';
import { LoadableValue } from 'app/components/LoadableValue';
import { watchPrice } from 'utils/pair-price-tracker';

interface IPairNavbarInfoProps {
  pair: ITradingPairs;
}

export const PairNavbarInfo: React.FC<IPairNavbarInfoProps> = ({ pair }) => {
  const { t } = useTranslation();
  const [lowPrice, setLowPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [lastPriceEvent, setLastPriceEvent] = useState(0);
  const [percent, setPercent] = useState(0);

  const getPercentageChange = (currentPrice: number, prevPrice: number) => {
    const diff = currentPrice - prevPrice;
    if (diff === 0) {
      return 0;
    }
    return (diff / prevPrice) * 100;
  };

  useEffect(() => {
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
      /** BTC is quote symbol */
      if (pairData[0].trading_pairs === pairData[1].trading_pairs) {
        lastPrice = pairData[0].last_price;
        percentageChange = pairData[0].price_change_percent_24h;
        highPrice = pairData[0].high_price_24h;
        lowPrice = pairData[0].lowest_price_24h;
      } else {
        lastPrice = pairData[0].last_price * (1 / pairData[1].last_price);
        percentageChange = getPercentageChange(
          lastPrice,
          pairData[0].day_price * (1 / pairData[1].day_price),
        );
        if (pairData[1].base_symbol === 'XUSD') {
          highPrice = pairData[0].high_price_24h_usd;
          lowPrice = pairData[0].lowest_price_24h_usd;
        }
      }

      return {
        lastPrice,
        percentageChange,
        highPrice,
        lowPrice,
      };
    };
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

  const _lastPrice = useMemo(() => lastPriceEvent || lastPrice, [
    lastPrice,
    lastPriceEvent,
  ]);

  return (
    <div className="tw-flex tw-items-center tw-justify-around tw-flex-1 tw-text-xs">
      <div className="tw-hidden sm:tw-flex tw-items-center tw-text-center tw-flex-row">
        {t(translations.pairNavbar.lastTradedPrice)}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-primary">
          <LoadableValue
            value={toNumberFormat(_lastPrice, 8)}
            loading={undefined}
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
            loading={undefined}
          />
        </span>
      </div>

      <div className="tw-hidden lg:tw-flex tw-items-center tw-text-center tw-flex-row">
        {lowPrice > 0 && (
          <div>
            {t(translations.pairNavbar.dayLow)}
            <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-short">
              <LoadableValue
                value={toNumberFormat(lowPrice, 8)}
                loading={undefined}
              />
            </span>
          </div>
        )}{' '}
      </div>
      <div className="tw-hidden xl:tw-flex tw-items-center tw-text-center tw-flex-row">
        {highPrice > 0 && (
          <div>
            {t(translations.pairNavbar.dayHigh)}{' '}
            <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-long">
              <LoadableValue
                value={toNumberFormat(highPrice, 8)}
                loading={undefined}
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

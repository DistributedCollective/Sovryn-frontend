import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function PriceHistory() {
  const { t } = useTranslation();
  const url = backendUrl[currentChainId];
  const [currentPrice, setCurrentPrice] = useState(-1);
  const [turnover, setTurnover] = useState(-1);
  useEffect(() => {
    axios.get(url + '/sov/current-price').then(({ data }) => {
      setCurrentPrice(data.price * 1e8);
    });
    axios.get(url + '/sov/trading-volume').then(({ data }) => {
      setTurnover(data.total.sov);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="py-2 tw-border-t-2 tw-border-b-2 tw-border-white tw-flex tw-align-center tw-justify-around tw-text-sm">
      {/* <div>
        24hr % Change: <span>+1.45%</span>
      </div>
      <div>
        24hr Low: <span>76225 Sats</span>
      </div>
      <div>
        24hr Low: <span>76225 Sats</span>
      </div> */}
      <div>
        {t(translations.spotTradingPage.priceHistory.turnover)}:{' '}
        {turnover > -1 && (
          <b>{Number(turnover.toFixed(2)).toLocaleString()} SOV</b>
        )}
      </div>
      <div className="tw-text-primary ">
        {t(translations.spotTradingPage.priceHistory.lastTradedPrice)}:{' '}
        {currentPrice > -1 && <b>{currentPrice.toLocaleString()} sats</b>}
      </div>
    </div>
  );
}

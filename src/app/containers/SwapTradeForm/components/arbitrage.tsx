import React, { useState, useEffect } from 'react';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import axios from 'axios';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Popover, Icon } from '@blueprintjs/core';

const s = translations.swapTradeForm;

export function Arbitrage() {
  const { t } = useTranslation();
  const api = backendUrl[currentChainId];
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    USDT: {
      oracleRate: '0',
      negativeDelta: false,
      rateToBalance: { amount: 0, from: '', to: '', rate: 0, earn: 0 },
    },
  });

  useEffect(() => {
    axios
      .get(api + '/amm/arbitrage')
      .then(res => setData(res.data))
      .catch(e => console.log(e));
  }, [api]);

  useEffect(() => {
    // Only show component if you can earn > 0.001 BTC or > 1 USDT. 'BTC' and 'USDT' need to match token names on backend
    if (
      (data.USDT.rateToBalance.earn > 0.001 &&
        symbolByTokenAddress(data.USDT.rateToBalance.to) === 'RBTC') ||
      (data.USDT.rateToBalance.earn > 10 &&
        symbolByTokenAddress(data.USDT.rateToBalance.to) === 'USDT')
    ) {
      setShow(true);
    }
  }, [data]);

  const fromAmount = data.USDT.rateToBalance.amount.toFixed(4);
  const fromToken = symbolByTokenAddress(data.USDT.rateToBalance.from);
  const toAmount = data.USDT.rateToBalance.rate.toFixed(2);
  const toToken = symbolByTokenAddress(data.USDT.rateToBalance.to);

  return (
    <>
      {show && (
        <div className="my-3">
          <div className="text-white mb-5 p-3 rounded border border-gold ">
            {t(s.arbitrage.best_rate)}{' '}
            <span className="text-gold">
              {fromAmount} {fromToken}
            </span>{' '}
            {t(s.arbitrage.for)}{' '}
            <span className="text-gold">
              {toAmount} {toToken}
            </span>
            <Popover
              content={
                <div className="px-5 py-4 font-weight-light">
                  <p>
                    {t(s.arbitrage.popover_p1, {
                      fromAmount: fromAmount,
                      fromToken: fromToken,
                      toAmount: toAmount,
                      toToken: toToken,
                      earn: data.USDT.rateToBalance.earn.toFixed(4),
                    })}
                  </p>
                  <p>
                    {t(s.arbitrage.popover_p2, {
                      fromToken: fromToken,
                    })}
                  </p>
                </div>
              }
              className="pl-3"
              popoverClassName={'w-50 mx-1'}
            >
              <Icon icon={'info-sign'} />
            </Popover>
          </div>
        </div>
      )}
    </>
  );
}

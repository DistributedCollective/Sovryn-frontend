import React, { useState, useEffect } from 'react';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import axios from 'axios';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Popover, Icon } from '@blueprintjs/core';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { usePriceFeeds_QueryRate } from '../../../hooks/price-feeds/useQueryRate';
import { Asset } from 'types/asset';

const s = translations.swapTradeForm;

export function Arbitrage() {
  const { t } = useTranslation();
  const api = backendUrl[currentChainId];
  const [data, setData] = useState({
    USDT: {
      oracleRate: '0',
      negativeDelta: false,
      rateToBalance: { amount: 0, from: '', to: '', rate: 0 },
    },
  });
  const { value } = usePriceFeeds_QueryRate(Asset.RBTC, Asset.USDT);

  useEffect(() => {
    axios
      .get(api + '/amm/arbitrage')
      .then(res => setData(res.data))
      .catch(e => console.log(e));
  }, [api]);

  function calculateEarn(isNegative, fromAmount, toAmount) {
    const rate = parseFloat(weiToFixed(value.rate, 8));
    const oraclePrice = isNegative
      ? (1 / rate) * fromAmount
      : rate * fromAmount;
    return (toAmount - oraclePrice).toFixed(4);
  }

  const fromAmount = data.USDT.rateToBalance.amount.toFixed(4);
  const fromToken = symbolByTokenAddress(data.USDT.rateToBalance.from);
  const toAmount = data.USDT.rateToBalance.rate.toFixed(2);
  const toToken = symbolByTokenAddress(data.USDT.rateToBalance.to);
  const earn = calculateEarn(
    data.USDT.negativeDelta,
    data.USDT.rateToBalance.amount,
    data.USDT.rateToBalance.rate,
  );
  const tooltipText = (
    <div className="px-5 py-4 font-weight-light">
      <p>
        {t(s.arbitrage.popover_p1, {
          fromAmount: fromAmount,
          fromToken: fromToken,
          toAmount: toAmount,
          toToken: toToken,
          earn: earn,
        })}
      </p>
      <p>
        {t(s.arbitrage.popover_p2, {
          fromToken: fromToken,
        })}
      </p>
    </div>
  );

  return (
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
          content={tooltipText}
          className="pl-3"
          popoverClassName={'w-50 mx-1'}
        >
          <Icon icon={'info-sign'} />
        </Popover>
      </div>
    </div>
  );
}

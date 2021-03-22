import React, { useState, useEffect } from 'react';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import axios from 'axios';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

const s = translations.swapTradeForm;

export function Arbitrage() {
  const { t } = useTranslation();
  const api = backendUrl[currentChainId];
  const [data, setData] = useState({
    USDT: {
      rateToBalance: { amount: 0, from: '', to: '', rate: 0 },
    },
  });

  useEffect(() => {
    axios.get(api + 'amm/arbitrage').then(res => setData(res.data));
  }, [api]);

  const fromAmount = data.USDT.rateToBalance.amount;
  const fromToken = symbolByTokenAddress(data.USDT.rateToBalance.from);
  const toAmount = data.USDT.rateToBalance.rate;
  const toToken = symbolByTokenAddress(data.USDT.rateToBalance.to);

  return (
    <div className="my-3">
      <div className="text-white mb-5 p-3 rounded border border-gold ">
        {t(s.arbitrage.best_rate)}{' '}
        <span className="text-gold">
          {fromAmount.toFixed(2)} {fromToken}
        </span>{' '}
        {t(s.arbitrage.for)}{' '}
        <span className="text-gold">
          {toAmount.toFixed(4)} {toToken}
        </span>
      </div>
    </div>
  );
}

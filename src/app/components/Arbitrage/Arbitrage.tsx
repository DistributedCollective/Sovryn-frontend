import React, { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Icon, Popover } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { backendUrl, currentChainId } from '../../../utils/classifiers';
import { useFetch } from '../../hooks/useFetch';
import { Asset } from '../../../types';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { fixNumber } from '../../../utils/helpers';
import { AssetSymbolRenderer } from '../AssetSymbolRenderer';
import { toNumberFormat } from '../../../utils/display-text/format';

const s = translations.swapTradeForm;

const minUsdForOpportunity = 10;

interface PoolData {
  [pool: string]: {
    oracleRate: string;
    negativeDelta: boolean;
    rateToBalance: {
      amount: number;
      from: string;
      to: string;
      rate: number;
      earn: number;
    };
  };
}

export function Arbitrage() {
  const { t } = useTranslation();
  const { assetRates } = useSelector(selectWalletProvider);

  const { value: data } = useFetch<PoolData>(
    backendUrl[currentChainId] + '/amm/arbitrage',
    {},
  );

  const opportunityArray = useMemo(() => {
    const opportunities: {
      fromToken: Asset;
      toToken: Asset;
      fromAmount: number;
      toAmount: number;
      earn: number;
      earnUsd: number;
    }[] = [];
    for (let pool in data) {
      if (
        data.hasOwnProperty(pool) &&
        data[pool].hasOwnProperty('rateToBalance')
      ) {
        const toToken = assetByTokenAddress(data[pool].rateToBalance.to);
        const rate = assetRates.find(
          item => item.source === toToken && item.target === Asset.USDT,
        );
        opportunities.push({
          fromToken: assetByTokenAddress(data[pool].rateToBalance.from),
          toToken,
          fromAmount: data[pool].rateToBalance.amount,
          toAmount: data[pool].rateToBalance.rate,
          earn: data[pool].rateToBalance.earn,
          earnUsd: rate
            ? Number(
                bignumber(fixNumber(rate.value.rate))
                  .mul(data[pool].rateToBalance.earn)
                  .div(rate.value.precision)
                  .toFixed(18),
              )
            : 0,
        });
      }
    }
    return opportunities.sort((a, b) => b.earnUsd - a.earnUsd);
  }, [data, assetRates]);

  const opportunity = useMemo(() => {
    const items = opportunityArray.filter(
      item => item.earnUsd > minUsdForOpportunity,
    );
    return items.length ? items[0] : null;
  }, [opportunityArray]);

  return (
    <>
      {opportunity !== null && (
        <div className="my-3">
          <div className="text-white mb-5 p-3 rounded border border-gold ">
            {t(s.arbitrage.best_rate)}{' '}
            <span className="text-gold">
              {toNumberFormat(opportunity.fromAmount, 6)}{' '}
              <AssetSymbolRenderer asset={opportunity.fromToken} />
            </span>{' '}
            {t(s.arbitrage.for)}{' '}
            <span className="text-gold">
              {toNumberFormat(opportunity.toAmount, 6)}{' '}
              <AssetSymbolRenderer asset={opportunity.toToken} />
            </span>
            <Popover
              content={
                <div className="px-5 py-4 font-weight-light">
                  <p>
                    {t(s.arbitrage.popover_p1, {
                      fromAmount: toNumberFormat(opportunity.fromAmount, 6),
                      fromToken: opportunity.fromToken,
                      toAmount: toNumberFormat(opportunity.toAmount, 6),
                      toToken: opportunity.toToken,
                      earn: toNumberFormat(opportunity.earn, 6),
                    })}
                  </p>
                  <p>
                    {t(s.arbitrage.popover_p2, {
                      fromToken: opportunity.fromToken,
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

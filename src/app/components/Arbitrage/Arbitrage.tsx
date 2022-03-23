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
import { fixNumber, isNullOrUndefined } from '../../../utils/helpers';
import { AssetSymbolRenderer } from '../AssetSymbolRenderer';
import { toNumberFormat } from '../../../utils/display-text/format';
import type { PoolData } from './models/pool-data';
import type { Opportunity } from './models/opportunity';

const s = translations.swapTradeForm;

const minUsdForOpportunity = 10;

export const isValidArbitrage = arbitrage => {
  const rateToBalance = arbitrage?.rateToBalance;
  return (
    rateToBalance &&
    !isNullOrUndefined(rateToBalance.earn) &&
    !isNullOrUndefined(rateToBalance.amount) &&
    !isNullOrUndefined(rateToBalance.rate) &&
    rateToBalance.to
  );
};

export function Arbitrage() {
  const { t } = useTranslation();
  const { assetRates } = useSelector(selectWalletProvider);

  const { value: data } = useFetch<PoolData>(
    backendUrl[currentChainId] + '/amm/arbitrage',
    {},
  );

  const opportunityArray = useMemo(
    () =>
      Object.values(data)
        .filter(isValidArbitrage)
        .map(item => {
          try {
            const toToken = assetByTokenAddress(item.rateToBalance.to);
            const rate = assetRates.find(
              item => item.source === toToken && item.target === Asset.USDT,
            );
            return {
              fromToken: assetByTokenAddress(item.rateToBalance.from),
              toToken,
              fromAmount: item.rateToBalance.amount,
              toAmount: item.rateToBalance.rate,
              earn: item.rateToBalance.earn,
              earnUsd: rate
                ? Number(
                    bignumber(fixNumber(rate.value.rate))
                      .mul(item.rateToBalance.earn)
                      .div(rate.value.precision)
                      .toFixed(18),
                  )
                : 0,
            };
          } catch (error) {
            console.error(error);
          }
          return {
            earnUsd: NaN,
          };
        })
        .sort((a, b) => b.earnUsd - a.earnUsd) as Opportunity[],
    [data, assetRates],
  );

  const opportunity = useMemo(() => {
    const items = opportunityArray.filter(
      item => item.earnUsd > minUsdForOpportunity,
    );
    return items.length ? items[0] : null;
  }, [opportunityArray]);

  return (
    <>
      {opportunity !== null && (
        <div className="tw-my-3">
          <div className="tw-text-sov-white tw-mb-12 tw-p-4 tw-rounded tw-border tw-border-primary">
            {t(s.arbitrage.best_rate)}{' '}
            <span className="tw-text-primary">
              {toNumberFormat(opportunity.fromAmount, 6)}{' '}
              <AssetSymbolRenderer asset={opportunity.fromToken} />
            </span>{' '}
            {t(s.arbitrage.for)}{' '}
            <span className="tw-text-primary">
              {toNumberFormat(opportunity.toAmount, 6)}{' '}
              <AssetSymbolRenderer asset={opportunity.toToken} />
            </span>
            <Popover
              content={
                <div className="tw-px-12 tw-py-8 tw-font-normal">
                  <p>
                    {t(s.arbitrage.popover_p1, {
                      fromAmount: toNumberFormat(opportunity.fromAmount, 6),
                      fromToken: opportunity.fromToken,
                      toAmount: toNumberFormat(opportunity.toAmount, 6),
                      toToken: opportunity.toToken,
                    })}
                  </p>
                  <p>
                    {t(s.arbitrage.popover_p2, {
                      toToken: opportunity.toToken,
                      earn: toNumberFormat(opportunity.earn, 6),
                    })}
                  </p>
                </div>
              }
              className="tw-pl-4"
              popoverClassName={'tw-w-1/2 tw-mx-1'}
            >
              <Icon icon={'info-sign'} />
            </Popover>
          </div>
        </div>
      )}
    </>
  );
}

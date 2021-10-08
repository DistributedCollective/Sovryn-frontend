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
// import { ActionButton } from '../Form/ActionButton';

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

interface IArbitrageProps {
  onClick: (source: Asset, target: Asset) => void;
}

export const Arbitrage: React.FC<IArbitrageProps> = props => {
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
      {/* <div className="tw-my-3">
        <div className="tw-flex tw-items-center tw-m-auto tw-w-full tw-max-w-3xl tw-mb-3">
          <p className="tw-m-0 tw-whitespace-nowrap tw-mr-8">
            Arbitrage opportunity
          </p>
          <div className="tw-border-t tw-border-sov-white tw-w-full"></div>
        </div>
        <div className="tw-bg-gray-5 tw-rounded-lg tw-py-3 tw-px-5 tw-m-auto tw-w-full tw-max-w-3xl tw-mb-11 tw-flex tw-items-center tw-justify-between">
          <p className="tw-font-light tw-m-0 tw-text-sov-white tw-text-sm tw-mr-3">
            Earn{' '}
            <span className="tw-text-success tw-font-semibold">+125.02%</span>{' '}
            above the market on swapping BPro for RBTC
          </p>
          <div className="tw-flex tw-items-center">
            <Icon icon="info-sign" className="tw-cursor-pointer" />
            <ActionButton
              text={t(translations.mainMenu.swap)}
              className="tw-block tw-rounded-50 tw-uppercase tw-bg-primary-25 hover:tw-opacity-75 tw-ml-4"
              textClassName="tw-text-base"
              // onClick={() => props.onClick(opportunity.fromToken, opportunity.toToken)}
              onClick={() => props.onClick(Asset.DOC, Asset.FISH)}
            />
          </div>
        </div>
      </div> */}
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
                <div className="tw-px-12 tw-py-8 tw-font-light">
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
};

import React, { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { Trans, useTranslation } from 'react-i18next';
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
import { Button, ButtonSize, ButtonStyle } from '../Button';

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

export const Arbitrage: React.FC<IArbitrageProps> = ({ onClick }) => {
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
          <div className="tw-bg-gray-5 tw-rounded-lg tw-py-3 tw-px-5 tw-m-auto tw-w-full tw-max-w-3xl tw-mb-11 tw-flex tw-items-center tw-justify-between tw-flex-col">
            <div className="tw-text-sov-white tw-pt-1 tw-pb-3 tw-w-full">
              <p className="tw-m-0 tw-whitespace-nowrap tw-mr-8 tw-mb-2">
                {t(s.arbitrage.best_rate)}
              </p>
              <div className="tw-border-t tw-border-sov-white tw-w-full"></div>
            </div>
            <div className="tw-flex tw-items-center tw-justify-between">
              <p className="tw-font-light tw-m-0 tw-text-sov-white tw-text-sm tw-mr-3">
                <Trans
                  i18nKey={s.arbitrage.text}
                  components={[
                    <span className="tw-text-success tw-font-normal"></span>,
                    <AssetSymbolRenderer asset={opportunity.fromToken} />,
                    <AssetSymbolRenderer asset={opportunity.toToken} />,
                  ]}
                  values={{
                    percent:
                      '+' +
                      toNumberFormat(
                        (opportunity.earn /
                          (opportunity.toAmount - opportunity.earn)) *
                          100,
                        2,
                      ),
                  }}
                />
              </p>
              <div className="tw-flex tw-items-center">
                <div className="tw-relative">
                  <Popover
                    content={
                      <div className="tw-p-5 tw-font-normal">
                        <p>
                          {t(s.arbitrage.popover_p1, {
                            fromAmount: toNumberFormat(
                              opportunity.fromAmount,
                              6,
                            ),
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
                    popoverClassName={'tw-mw-340'}
                  >
                    <Icon icon="info-sign" className="tw-cursor-pointer" />
                  </Popover>
                </div>
                <Button
                  text={t(translations.mainMenu.swap)}
                  size={ButtonSize.md}
                  style={ButtonStyle.frosted}
                  onClick={() =>
                    onClick(opportunity.fromToken, opportunity.toToken)
                  }
                  className="tw-ml-4"
                  dataActionId="swap-button"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

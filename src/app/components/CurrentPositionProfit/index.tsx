import React from 'react';
import { Asset } from 'types/asset';
import {
  calculateProfit,
  toNumberFormat,
  weiToNumberFormat,
  weiToUSD,
} from 'utils/display-text/format';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../LoadableValue';
import { AssetRenderer } from '../AssetRenderer';
import { useGetProfitDollarValue } from 'app/hooks/trading/useGetProfitDollarValue';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface ICurrentPositionProfitProps {
  source: Asset;
  destination: Asset;
  amount: string;
  startPrice: number;
  isLong: boolean;
}

export const CurrentPositionProfit: React.FC<ICurrentPositionProfitProps> = ({
  source,
  destination,
  amount,
  startPrice,
  isLong,
}) => {
  const { t } = useTranslation();
  const { loading, price } = useCurrentPositionPrice(
    destination,
    source,
    amount,
    isLong,
  );

  const [profit, diff] = calculateProfit(isLong, price, startPrice, amount);

  const [dollarValue, dollarsLoading] = useGetProfitDollarValue(
    destination,
    profit,
  );

  function Change() {
    if (diff > 0) {
      return (
        <>
          {t(translations.tradingHistoryPage.table.profitLabels.up)}
          <span className="tw-text-trade-long">
            {toNumberFormat(diff * 100, 2)}
          </span>
          %
        </>
      );
    }
    if (diff < 0) {
      return (
        <>
          {t(translations.tradingHistoryPage.table.profitLabels.down)}
          <span className="tw-text-trade-short">
            {toNumberFormat(Math.abs(diff * 100), 2)}
          </span>
          %
        </>
      );
    }
    return (
      <>{t(translations.tradingHistoryPage.table.profitLabels.noChange)}</>
    );
  }
  return (
    <>
      <LoadableValue
        loading={loading}
        value={
          <div className="tw-flex tw-items-center">
            <span
              className={classNames({
                'tw-text-trade-short': diff < 0,
                'tw-text-trade-long': diff > 0,
              })}
            >
              <div>
                {diff > 0 && '+'}
                {weiToNumberFormat(profit, 6)}{' '}
                <AssetRenderer asset={destination} />
              </div>
              ≈{' '}
              <LoadableValue
                value={weiToUSD(dollarValue)}
                loading={dollarsLoading}
              />
            </span>
            <div className="tw-hidden 2xl:tw-table">
              {diff > 0 ? (
                <span className="tw-text-trade-long tw-ml-2">
                  (+{toNumberFormat(diff * 100, 2)}%)
                </span>
              ) : (
                <span className="tw-text-trade-short tw-ml-2">
                  (-{toNumberFormat(Math.abs(diff * 100), 2)}%)
                </span>
              )}
            </div>
          </div>
        }
        tooltip={<Change />}
      />
    </>
  );
};

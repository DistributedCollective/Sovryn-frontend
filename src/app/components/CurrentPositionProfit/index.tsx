import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import {
  toNumberFormat,
  weiToNumberFormat,
  weiToUSD,
} from 'utils/display-text/format';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../LoadableValue';
import { bignumber } from 'mathjs';
import { AssetRenderer } from '../AssetRenderer';
import { useGetProfitDollarValue } from 'app/hooks/trading/useGetProfitDollarValue';

interface Props {
  source: Asset;
  destination: Asset;
  amount: string;
  startPrice: number;
  isLong: boolean;
}

const calculateProfit = (
  isLong: boolean,
  currentPrice: number,
  startPrice: number,
  amount: string,
): [string, number] => {
  let profit = '0';

  let diff = 1;
  if (isLong) {
    diff = (currentPrice - startPrice) / currentPrice;
    profit = bignumber(amount).mul(diff).toFixed(0);
  } else {
    diff = (startPrice - currentPrice) / startPrice;
    profit = bignumber(amount).mul(diff).toFixed(0);
  }

  return [profit, diff];
};

export function CurrentPositionProfit({
  source,
  destination,
  amount,
  startPrice,
  isLong,
}: Props) {
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
          <span className="tw-text-success">
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
          <span className="tw-text-warning">
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
          <>
            <span className={diff < 0 ? 'tw-text-warning' : 'tw-text-success'}>
              <div>
                {diff > 0 && '+'}
                {weiToNumberFormat(profit, 8)}{' '}
                <AssetRenderer asset={destination} />
              </div>
              ≈{' '}
              <LoadableValue
                value={weiToUSD(dollarValue)}
                loading={dollarsLoading}
              />
            </span>
          </>
        }
        tooltip={
          <>
            <Change />
          </>
        }
      />
    </>
  );
}

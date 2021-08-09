import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { Tooltip2 } from '@blueprintjs/popover2';
import { backendUrl, currentChainId } from 'utils/classifiers';
import {
  numberToUSD,
  toNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../LoadableValue';
import { bignumber } from 'mathjs';
import { AssetRenderer } from '../AssetRenderer';
import { useGetProfitDollarValue } from 'app/hooks/trading/useGetProfitDollarValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';

interface Props {
  source: Asset;
  destination: Asset;
  amount: string;
  startPrice: number;
  isLong: boolean;
  loanId: string;
}

export function CurrentPositionProfit({
  source,
  destination,
  amount,
  isLong,
  loanId,
}: Props) {
  const { t } = useTranslation();
  const { loading, price } = useCurrentPositionPrice(
    destination,
    source,
    amount,
    isLong,
  );

  const [profit, setProfit] = useState<string>('0');
  const [profitDirection, setProfitDirection] = useState<number>(0);

  fetch(backendUrl[currentChainId] + '/loanEvents?loanId=' + loanId)
    .then(response => {
      return response.json();
    })
    .then(loanEvents => {
      const entryPrice = loanEvents.Trade[0].entry_price;
      if (isLong) {
        setProfitDirection((price - entryPrice) / price);
        setProfit(bignumber(amount).mul(profitDirection).toFixed(0));
      } else {
        setProfitDirection((entryPrice - price) / entryPrice);
        setProfit(bignumber(amount).mul(profitDirection).toFixed(0));
      }
    })
    .catch(console.error);

  const [dollarValue, dollarsLoading] = useGetProfitDollarValue(
    destination,
    profit,
  );

  function Change() {
    if (profitDirection > 0) {
      return (
        <>
          {t(translations.tradingHistoryPage.table.profitLabels.up)}
          <span className="tw-text-green">
            {toNumberFormat(profitDirection * 100, 2)}
          </span>
          %
        </>
      );
    }
    if (profitDirection < 0) {
      return (
        <>
          {t(translations.tradingHistoryPage.table.profitLabels.down)}
          <span className="tw-text-red">
            {toNumberFormat(Math.abs(profitDirection * 100), 2)}
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
    <div>
      <Tooltip2
        content={
          <>
            <Change />
          </>
        }
      >
        <LoadableValue
          loading={loading}
          value={
            <>
              <span
                className={
                  profitDirection < 0 ? 'tw-text-red' : 'tw-text-green'
                }
              >
                <div>
                  {profitDirection > 0 && '+'}
                  {weiToNumberFormat(profit, 8)}{' '}
                  <AssetRenderer asset={destination} />
                </div>
                ≈{' '}
                <LoadableValue
                  value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
                  loading={dollarsLoading}
                />
              </span>
            </>
          }
        />
      </Tooltip2>
    </div>
  );
}

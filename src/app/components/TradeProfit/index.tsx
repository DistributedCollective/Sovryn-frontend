import React from 'react';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { TradingPosition } from '../../../types/trading-position';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { Asset } from '../../../types/asset';
import { translations } from '../../../locales/i18n';

interface Props {
  entryPrice: string;
  closePrice: string;
  profit: string;
  position: TradingPosition;
  asset: Asset;
}

export function TradeProfit(props: Props) {
  let change = bignumber(bignumber(props.closePrice).minus(props.entryPrice))
    .div(props.entryPrice)
    .mul(100)
    .toNumber();
  if (props.position === TradingPosition.SHORT) {
    change = bignumber(bignumber(props.entryPrice).minus(props.closePrice))
      .div(props.entryPrice)
      .mul(100)
      .toNumber();
  }

  return (
    <div>
      <Tooltip
        content={
          <>
            <Change change={Number(change)} />
          </>
        }
      >
        <span className={change < 0 ? 'tw-text-warning' : 'tw-text-success'}>
          {change > 0 && '+'}
          {weiToNumberFormat(props.profit, 8)} {props.asset}
        </span>
      </Tooltip>
    </div>
  );
}

function Change({ change }: { change: number }) {
  const { t } = useTranslation();
  if (change > 0) {
    return (
      <>
        {t(translations.tradingHistoryPage.table.profitLabels.up)}
        <span className="tw-text-success">{toNumberFormat(change, 2)}</span>%
      </>
    );
  }
  if (change < 0) {
    return (
      <>
        {t(translations.tradingHistoryPage.table.profitLabels.down)}
        <span className="tw-text-warning">
          {toNumberFormat(Math.abs(change), 2)}
        </span>
        %
      </>
    );
  }
  return <>{t(translations.tradingHistoryPage.table.profitLabels.noChange)}</>;
}

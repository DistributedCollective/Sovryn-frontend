import React, { useState } from 'react';
import { bignumber } from 'mathjs';
import { Tooltip2 } from '@blueprintjs/popover2';
import { useTranslation } from 'react-i18next';
import { TradingPosition } from '../../../types/trading-position';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { toWei } from 'utils/blockchain/math-helpers';
import { TradingPair } from 'utils/models/trading-pair';
import { useAccount } from '../../hooks/useAccount';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { Asset } from '../../../types/asset';
import { translations } from '../../../locales/i18n';

interface Props {
  asset: Asset;
  entryPrice: string;
  closePrice: string;
  position: TradingPosition;
  positionSize: string;
  loanToken: string;
  pair: TradingPair;
}

export function TradeProfit(props: Props) {
  const account = useAccount();
  const [profit, setProfit] = useState<string>('');
  const [profitDirection, setProfitDirection] = useState<number>(0);
  const prettyPrice = amount => {
    return props.loanToken !== props.pair.shortAsset
      ? toWei(
          bignumber(1)
            .div(amount)
            .mul(10 ** 8),
        )
      : toWei(bignumber(amount).div(10 ** 8));
  };

  fetch(backendUrl[currentChainId] + '/trade/loan/0x4e49f3b55c35773375a84812344b9669d93f84ae9cf7614b8977cc7d5cdf1736')
    .then(response => {
      return response.json();
    })
    .then(loanEvents => {
      console.log('loanEvents history', loanEvents);

      const entryPrice = prettyPrice(loanEvents.Trade[0].entry_price);
      const closePrice = prettyPrice(loanEvents.CloseWithSwap[0].exit_price);

      //LONG position
      let change = bignumber(bignumber(closePrice).minus(entryPrice))
        .div(entryPrice)
        .mul(100)
        .toNumber();

      //SHORT position
      if (props.position === TradingPosition.SHORT) {
        change = bignumber(bignumber(entryPrice).minus(closePrice))
          .div(entryPrice)
          .mul(100)
          .toNumber();
      }
      setProfit(
        bignumber(change)
          .mul(bignumber(props.positionSize))
          .div(100)
          .toFixed(0),
      );
      setProfitDirection(change);
    })
    .catch(console.error);

  return (
    <div>
      <Tooltip2
        content={
          <>
            <Change profitDirection={Number(profitDirection)} />
          </>
        }
      >
        <span className={profitDirection < 0 ? 'tw-text-red' : 'tw-text-green'}>
          {profitDirection > 0 && '+'}
          {weiToNumberFormat(profit, 8)} {props.asset}
        </span>
      </Tooltip2>
    </div>
  );
}

function Change({ profitDirection }: { profitDirection: number }) {
  const { t } = useTranslation();
  if (profitDirection > 0) {
    return (
      <>
        {t(translations.tradingHistoryPage.table.profitLabels.up)}
        <span className="tw-text-green">
          {toNumberFormat(profitDirection, 2)}
        </span>{' '}
        %
      </>
    );
  }
  if (profitDirection < 0) {
    return (
      <>
        {t(translations.tradingHistoryPage.table.profitLabels.down)}
        <span className="tw-text-red">
          {toNumberFormat(Math.abs(profitDirection), 2)}
        </span>{' '}
        %
      </>
    );
  }
  return <>{t(translations.tradingHistoryPage.table.profitLabels.noChange)}</>;
}

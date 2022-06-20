import React, { useState, useEffect } from 'react';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import { toAssetNumberFormat } from 'utils/display-text/format';
import { translations } from 'locales/i18n';
import { AssetRenderer } from '../AssetRenderer';
import { Asset } from 'types/asset';

interface ITradeProfitProps {
  collateralAsset: Asset;
  position: TradingPosition;
  openPrice: string;
  closePrice: string;
  realizedPnL: string;
  realizedPnLPercent: string;
}

export const TradeProfit: React.FC<ITradeProfitProps> = ({
  collateralAsset,
  position,
  openPrice,
  closePrice,
  realizedPnL,
  realizedPnLPercent,
}) => {
  const { t } = useTranslation();
  const [profitDirection, setProfitDirection] = useState(0);

  useEffect(() => {
    //LONG position
    let change = bignumber(closePrice)
      .minus(openPrice)
      .div(openPrice)
      .mul(100)
      .toNumber();

    //SHORT position
    if (position === TradingPosition.SHORT) {
      change = bignumber(openPrice)
        .minus(closePrice)
        .div(openPrice)
        .mul(100)
        .toNumber();
    }
    setProfitDirection(change);
  }, [position, closePrice, openPrice]);

  return (
    <div>
      <Tooltip
        content={
          <>
            {profitDirection > 0 && (
              <>
                {t(translations.tradingHistoryPage.table.profitLabels.up)}
                <span className="tw-text-success">
                  {Number(realizedPnLPercent).toFixed(2)}
                </span>{' '}
                %
              </>
            )}
            {profitDirection < 0 && (
              <>
                {t(translations.tradingHistoryPage.table.profitLabels.down)}
                <span className="tw-text-warning">
                  {Number(realizedPnLPercent).toFixed(2)}
                </span>{' '}
                %
              </>
            )}
            {profitDirection === 0 && (
              <>
                {t(translations.tradingHistoryPage.table.profitLabels.noChange)}
              </>
            )}
          </>
        }
      >
        <span
          className={classNames(
            {
              'tw-text-warning': profitDirection < 0,
            },
            {
              'tw-text-success': profitDirection > 0,
            },
          )}
        >
          {profitDirection > 0 && '+'}
          {toAssetNumberFormat(realizedPnL, collateralAsset)}{' '}
          <AssetRenderer asset={collateralAsset} />
        </span>
      </Tooltip>
    </div>
  );
};

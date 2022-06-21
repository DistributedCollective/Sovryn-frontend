import React, { useState, useEffect } from 'react';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import { toNumberFormat } from 'utils/display-text/format';
import { translations } from 'locales/i18n';
import { AssetValue } from '../AssetValue';
import { Asset } from 'types/asset';

interface ITradeProfitProps {
  collateralAsset: Asset;
  position: TradingPosition;
  openPrice: string;
  closePrice: string;
  positionSize: string;
}

export const TradeProfit: React.FC<ITradeProfitProps> = ({
  collateralAsset,
  position,
  openPrice,
  closePrice,
  positionSize,
}) => {
  const { t } = useTranslation();
  const [profit, setProfit] = useState(0);
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
    setProfit(
      Math.abs(
        bignumber(change || '0')
          .mul(bignumber(positionSize || '0'))
          .div(100)
          .toNumber(),
      ),
    );
    setProfitDirection(change);
  }, [position, closePrice, openPrice, positionSize]);

  return (
    <div>
      <Tooltip
        content={
          <>
            {profitDirection > 0 && (
              <>
                {t(translations.tradingHistoryPage.table.profitLabels.up)}
                <span className="tw-text-success">
                  {toNumberFormat(profitDirection, 2)}
                </span>{' '}
                %
              </>
            )}
            {profitDirection < 0 && (
              <>
                {t(translations.tradingHistoryPage.table.profitLabels.down)}
                <span className="tw-text-warning">
                  {toNumberFormat(Math.abs(profitDirection), 2)}
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
          <AssetValue
            value={profit}
            asset={collateralAsset}
            showPositiveSign={true}
          />
        </span>
      </Tooltip>
    </div>
  );
};

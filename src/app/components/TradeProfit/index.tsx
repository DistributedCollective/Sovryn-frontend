import React, { useState, useEffect, useMemo } from 'react';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import {
  toNumberFormat,
  weiToAssetNumberFormat,
} from 'utils/display-text/format';
import { translations } from 'locales/i18n';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { getTradingPositionPrice } from 'app/pages/MarginTradePage/utils/marginUtils';
import { AssetRenderer } from '../AssetRenderer';
import { LoanEvent } from 'app/pages/MarginTradePage/components/OpenPositionsTable/hooks/useMargin_getLoanEvents';

interface ITradeProfitProps {
  closedItem: LoanEvent;
  openedItem: LoanEvent;
}

export const TradeProfit: React.FC<ITradeProfitProps> = ({
  closedItem,
  openedItem,
}) => {
  const { t } = useTranslation();
  const [profit, setProfit] = useState(0);
  const [profitDirection, setProfitDirection] = useState(0);

  const loanAsset = assetByTokenAddress(closedItem.loanToken);
  const collateralAsset = assetByTokenAddress(closedItem.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);
  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const openPrice = useMemo(
    () => getTradingPositionPrice(openedItem, position),
    [openedItem, position],
  );
  const closePrice = useMemo(
    () => getTradingPositionPrice(closedItem, position),
    [closedItem, position],
  );

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
          .mul(bignumber(openedItem.positionSizeChange || '0'))
          .div(100)
          .toNumber(),
      ),
    );
    setProfitDirection(change);
  }, [position, closePrice, openPrice, openedItem.positionSizeChange]);

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
          {profitDirection > 0 && '+'}
          {profitDirection < 0 && '-'}
          {weiToAssetNumberFormat(profit, collateralAsset)}{' '}
          <AssetRenderer asset={collateralAsset} />
        </span>
      </Tooltip>
    </div>
  );
};

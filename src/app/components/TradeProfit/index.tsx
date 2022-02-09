import React, { useState, useEffect, useMemo } from 'react';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { TradingPosition } from '../../../types/trading-position';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { translations } from '../../../locales/i18n';
import { toWei } from 'utils/blockchain/math-helpers';
import { OpenLoanType } from 'types/active-loan';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { getTradingPositionPrice } from 'app/pages/MarginTradePage/utils/marginUtils';
import { AssetRenderer } from '../AssetRenderer';
import classNames from 'classnames';

interface ITradeProfitProps {
  closedItem: OpenLoanType;
  openedItem: OpenLoanType;
}

export const TradeProfit: React.FC<ITradeProfitProps> = ({
  closedItem,
  openedItem,
}) => {
  const { t } = useTranslation();
  const [profit, setProfit] = useState('');
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
    let change = bignumber(bignumber(closePrice).minus(openPrice))
      .div(openPrice)
      .mul(100)
      .toNumber();

    //SHORT position
    if (position === TradingPosition.SHORT) {
      change = bignumber(bignumber(toWei(openPrice)).minus(toWei(closePrice)))
        .div(toWei(openPrice))
        .mul(100)
        .toNumber();
    }
    setProfit(
      bignumber(change)
        .mul(bignumber(openedItem.positionSizeChange))
        .div(100)
        .toFixed(0),
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
          {weiToNumberFormat(profit, 8)}{' '}
          <AssetRenderer asset={collateralAsset} />
        </span>
      </Tooltip>
    </div>
  );
};

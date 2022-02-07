import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import dayjs from 'dayjs';
import { ActionButton } from 'app/components/Form/ActionButton';
import type { OpenLoanType } from 'types/active-loan';
import { translations } from 'locales/i18n';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPosition } from 'types/trading-position';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToAssetNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { getEntryPrice } from '../../utils/marginUtils';
import { AddToMarginDialog } from '../AddToMarginDialog';
import { ClosePositionDialog } from '../ClosePositionDialog';
import { PositionBlock } from '../PositionBlock';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { Tooltip } from '@blueprintjs/core';
import { formatNumber } from 'app/containers/StatsPage/utils';
import { usePositionLiquidationPrice } from 'app/hooks/trading/usePositionLiquidationPrice';
import { ProfitContainer } from './ProfitContainer';
import { isLongTrade } from '../../utils/marginUtils';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { MAINTENANCE_MARGIN } from 'utils/classifiers';

type OpenPositionRowInnerProps = {
  item: OpenLoanType;
  nextRollover: number | null;
};

export const OpenPositionRow: React.FC<OpenPositionRowInnerProps> = ({
  item,
  nextRollover,
}) => {
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.CLOSE_MARGIN_TRADES]: closeTradesLocked,
    [States.ADD_TO_MARGIN_TRADES]: addToMarginLocked,
  } = checkMaintenances();

  const [showAddToMargin, setShowAddToMargin] = useState(false);
  const [showClosePosition, setShowClosePosition] = useState(false);

  const loanAsset = assetByTokenAddress(item.loanToken);
  const collateralAsset = assetByTokenAddress(item.collateralToken);

  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const isLong = useMemo(() => isLongTrade(position), [position]);

  const leverage = useMemo(() => item.leverage + 1, [item.leverage]);

  const liquidationPrice = usePositionLiquidationPrice(
    item.borrowedAmountChange,
    item.positionSizeChange,
    position,
    MAINTENANCE_MARGIN,
  );

  const entryPrice = useMemo(() => getEntryPrice(item, position), [
    item,
    position,
  ]);

  const positionMargin = useMemo(() => {
    if (isLong) {
      return bignumber(entryPrice)
        .mul(bignumber(item.positionSizeChange).div(leverage))
        .toString();
    }
    return bignumber(1)
      .div(entryPrice)
      .mul(bignumber(item.positionSizeChange).div(leverage))
      .toString();
  }, [entryPrice, item.positionSizeChange, leverage, isLong]);

  const positionMarginAsset = useMemo(
    () => (isLong ? pair.longAsset : pair.shortAsset),
    [isLong, pair],
  );

  return (
    <>
      <tr>
        <td className="tw-w-full">
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            {weiToAssetNumberFormat(item.positionSizeChange, collateralAsset)}{' '}
            <AssetRenderer asset={collateralAsset} /> ({leverage}x)
          </div>
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <Tooltip
              content={
                <>
                  {toNumberFormat(entryPrice, 18)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
            >
              <>
                {toAssetNumberFormat(entryPrice, pair.longDetails.asset)}{' '}
                <AssetRenderer asset={pair.longDetails.asset} />
              </>
            </Tooltip>
          </div>
        </td>
        <td className="tw-w-full tw-hidden md:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <Tooltip content={<>{toNumberFormat(liquidationPrice, 18)}</>}>
              <>
                {toAssetNumberFormat(liquidationPrice, pair.longDetails.asset)}{' '}
                <AssetRenderer asset={pair.longDetails.asset} />
              </>
            </Tooltip>
          </div>
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            <Tooltip
              content={
                <>
                  {weiToNumberFormat(positionMargin, 18)}{' '}
                  <AssetSymbolRenderer asset={positionMarginAsset} />
                </>
              }
            >
              <>
                {weiToAssetNumberFormat(positionMargin, positionMarginAsset)}{' '}
                <AssetSymbolRenderer asset={positionMarginAsset} />
              </>
            </Tooltip>
          </div>
        </td>
        <td className="tw-w-full tw-hidden sm:tw-table-cell">
          <ProfitContainer
            item={item}
            position={position}
            entryPrice={entryPrice}
            leverage={leverage}
          />
        </td>
        <td className="tw-w-full tw-hidden 2xl:tw-table-cell">
          <div className="tw-truncate">
            {toNumberFormat(item.interestRate, 2)}%
          </div>
        </td>
        <td className="tw-w-full tw-hidden 2xl:tw-table-cell">
          {nextRollover ? (
            dayjs(nextRollover * 1e3).format('DD/MM/YYYY')
          ) : (
            <>-</>
          )}
        </td>
        <td className="tw-w-full">
          <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
            <ActionButton
              text={t(translations.openPositionTable.cta.margin)}
              onClick={() => setShowAddToMargin(true)}
              className={`tw-border-none tw-px-4 xl:tw-px-2 2xl:tw-px-4 ${
                addToMarginLocked && 'tw-cursor-not-allowed'
              }`}
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={addToMarginLocked}
              title={
                (addToMarginLocked &&
                  t(translations.maintenance.addToMarginTrades).replace(
                    /<\/?\d+>/g,
                    '',
                  )) ||
                undefined
              }
              data-action-id="margin-openPositions-AddToMarginButton"
            />
            <ActionButton
              text={t(translations.openPositionTable.cta.close)}
              onClick={() => setShowClosePosition(true)}
              className={`tw-border-none tw-ml-0 tw-pl-4 xl:tw-pl-2 2xl:tw-pl-4 tw-pr-0 ${
                closeTradesLocked && 'tw-cursor-not-allowed'
              }`}
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={closeTradesLocked}
              title={
                (closeTradesLocked &&
                  t(translations.maintenance.closeMarginTrades).replace(
                    /<\/?\d+>/g,
                    '',
                  )) ||
                undefined
              }
              data-action-id="margin-openPositions-CloseButton"
            />
          </div>
          <AddToMarginDialog
            item={item}
            liquidationPrice={
              <>
                {formatNumber(Number(liquidationPrice), 2)}{' '}
                <AssetRenderer asset={pair.longDetails.asset} />
              </>
            }
            onCloseModal={() => setShowAddToMargin(false)}
            showModal={showAddToMargin}
          />
          <ClosePositionDialog
            item={item}
            onCloseModal={() => setShowClosePosition(false)}
            showModal={showClosePosition}
          />
        </td>
      </tr>
    </>
  );
};

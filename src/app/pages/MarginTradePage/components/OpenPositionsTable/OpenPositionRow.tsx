import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { ActionButton } from 'app/components/Form/ActionButton';
import { ActiveLoan } from 'types/active-loan';
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
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { leverageFromMargin } from 'utils/blockchain/leverage-from-start-margin';
import { AddToMarginDialog } from '../AddToMarginDialog';
import { ClosePositionDialog } from '../ClosePositionDialog';
import { PositionBlock } from './PositionBlock';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { LoadableValue } from 'app/components/LoadableValue';
import { formatNumber } from 'app/containers/StatsPage/utils';
import { usePositionLiquidationPrice } from 'app/hooks/trading/usePositionLiquidationPrice';
import { ProfitContainer } from './ProfitContainer';
import { isLongTrade } from './helpers';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

interface IOpenPositionRowInnerProps {
  item: ActiveLoan;
}

const OpenPositionRowInner: React.FC<IOpenPositionRowInnerProps> = ({
  item,
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

  const leverage = useMemo(() => leverageFromMargin(item.startMargin), [
    item.startMargin,
  ]);

  const liquidationPrice = usePositionLiquidationPrice(
    item.principal,
    item.collateral,
    position,
    item.maintenanceMargin,
  );

  const entryPrice = useMemo(() => getEntryPrice(item, position), [
    item,
    position,
  ]);

  const positionMargin = useMemo(() => {
    if (isLong) {
      return bignumber(entryPrice)
        .mul(bignumber(item.collateral).div(leverage))
        .toString();
    }
    return bignumber(1)
      .div(entryPrice)
      .mul(bignumber(item.collateral).div(leverage))
      .toString();
  }, [entryPrice, item.collateral, leverage, isLong]);

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
            <LoadableValue
              value={
                <>
                  {weiToAssetNumberFormat(item.collateral, collateralAsset)}{' '}
                  <AssetRenderer asset={collateralAsset} /> ({leverage}x)
                </>
              }
              loading={false}
              tooltip={
                <>
                  {weiTo18(item.collateral)}{' '}
                  <AssetRenderer asset={collateralAsset} /> ({leverage}x)
                </>
              }
            />
          </div>
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              value={
                <>
                  {toAssetNumberFormat(entryPrice, pair.longDetails.asset)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
              tooltip={toNumberFormat(entryPrice, 18)}
            />
          </div>
        </td>
        <td className="tw-w-full tw-hidden md:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              value={
                <>
                  {toAssetNumberFormat(
                    liquidationPrice,
                    pair.longDetails.asset,
                  )}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
              tooltip={toNumberFormat(liquidationPrice, 18)}
            />
          </div>
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            <LoadableValue
              value={
                <>
                  {weiToAssetNumberFormat(positionMargin, positionMarginAsset)}{' '}
                  <AssetSymbolRenderer asset={positionMarginAsset} />
                </>
              }
              tooltip={
                <>
                  {weiToNumberFormat(positionMargin, 18)}{' '}
                  <AssetSymbolRenderer asset={positionMarginAsset} />
                </>
              }
            />
          </div>
          <div className="tw-truncate tw-opacity-25">
            {weiToNumberFormat(item.currentMargin, 3)} %
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
            {toNumberFormat(getInterestAPR(item), 2)}%
          </div>
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
              disabled={addToMarginLocked || item.currentMargin === '0'}
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
              disabled={closeTradesLocked || item.currentMargin === '0'}
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
                {formatNumber(Number(liquidationPrice), 2)}&nbsp;&nbsp;
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

export const OpenPositionRow: React.FC<IOpenPositionRowInnerProps> = ({
  item,
}) => {
  try {
    const loanAsset = assetByTokenAddress(item.loanToken);
    const collateralAsset = assetByTokenAddress(item.collateralToken);
    const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);
    if (!loanAsset || !collateralAsset || !pair) return <></>;
    return <OpenPositionRowInner item={item} />;
  } catch (e) {
    console.error(e);
    console.info(item);
    return <></>;
  }
};

function getEntryPrice(item: ActiveLoan, position: TradingPosition) {
  if (position === TradingPosition.LONG) return Number(weiTo18(item.startRate));
  return 1 / Number(weiTo18(item.startRate));
}

function getInterestAPR(item: ActiveLoan) {
  return bignumber(item.interestOwedPerDay)
    .mul(365)
    .div(item.principal)
    .mul(100)
    .toNumber();
}

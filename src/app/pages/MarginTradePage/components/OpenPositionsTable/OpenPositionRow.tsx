import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { ActionButton } from 'app/components/Form/ActionButton';
import { ActiveLoan } from 'types/active-loan';
import { translations } from 'locales/i18n';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { assetByTokenAddress } from '../../../../../utils/blockchain/contract-helpers';
import { TradingPosition } from '../../../../../types/trading-position';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import { AddToMarginDialog } from '../AddToMarginDialog';
import { ClosePositionDialog } from '../ClosePositionDialog';
import { PositionBlock } from './PositionBlock';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { LoadableValue } from '../../../../components/LoadableValue';
import { formatNumber } from '../../../../containers/StatsPage/utils';
import { usePriceFeeds_QueryRate } from '../../../../hooks/price-feeds/useQueryRate';
import classNames from 'classnames';
import { usePositionLiquidationPrice } from '../../../../hooks/trading/usePositionLiquidationPrice';

interface IOpenPositionRowInnerProps {
  item: ActiveLoan;
}

const slippage = 0.1; // 10%

function OpenPositionRowInner({ item }: IOpenPositionRowInnerProps) {
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

  const isLong = position === TradingPosition.LONG;
  const leverage = leverageFromMargin(item.startMargin);

  const liquidationPrice = usePositionLiquidationPrice(
    item.principal,
    item.collateral,
    position,
    item.maintenanceMargin,
  );

  const {
    value: currentCollateralToPrincipalRate,
    loading,
  } = usePriceFeeds_QueryRate(
    assetByTokenAddress(item.collateralToken),
    assetByTokenAddress(item.loanToken),
  );

  const profit = useMemo(() => {
    let result = bignumber(0);
    let positionValue = bignumber(0);
    let openPrice = bignumber(0);

    const collateralAssetAmount = bignumber(item.collateral);
    const loanAssetAmount = bignumber(item.principal);

    if (isLong) {
      positionValue = collateralAssetAmount;
      openPrice = bignumber(item.startRate);
      result = bignumber(currentCollateralToPrincipalRate.rate)
        .minus(openPrice)
        .times(positionValue)
        .div(10 ** 18);

      result = result.minus(result.mul(slippage));
    } else {
      positionValue = collateralAssetAmount
        .times(currentCollateralToPrincipalRate.rate)
        .minus(loanAssetAmount);
      openPrice = bignumber(10 ** 36)
        .div(item.startRate)
        .div(10 ** 18); // div 10 **18 ?
      result = openPrice
        .minus(
          bignumber(1)
            .div(currentCollateralToPrincipalRate.rate)
            .times(10 ** 18),
        )
        .times(positionValue)
        .div(10 ** 18);
      result = result.add(result.mul(slippage));
    }

    return result.toString();
  }, [
    currentCollateralToPrincipalRate,
    isLong,
    item.collateral,
    item.principal,
    item.startRate,
  ]);

  const collateralAssetDetails = AssetsDictionary.get(collateralAsset);

  const amount = bignumber(item.collateral).div(leverage).toFixed(0);

  return (
    <>
      <tr>
        <td>
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td>
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              value={
                <>
                  {weiToNumberFormat(item.collateral, 4)}{' '}
                  <AssetRenderer asset={collateralAssetDetails.asset} />
                </>
              }
              tooltip={weiToNumberFormat(item.collateral, 18)}
            />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              value={
                <>
                  {toNumberFormat(getEntryPrice(item, position), 4)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
              tooltip={toNumberFormat(getEntryPrice(item, position), 18)}
            />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              value={
                <>
                  {toNumberFormat(liquidationPrice, 4)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
              tooltip={toNumberFormat(liquidationPrice, 18)}
            />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            <LoadableValue
              value={
                <>
                  {weiToNumberFormat(amount, 4)}{' '}
                  <AssetRenderer
                    asset={assetByTokenAddress(item.collateralToken)}
                  />{' '}
                  ({leverage}x)
                </>
              }
              tooltip={weiToNumberFormat(amount, 18)}
            />
          </div>
        </td>
        <td>
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              loading={loading}
              value={
                <span
                  className={classNames(
                    profit > '0' && 'tw-text-success',
                    profit < '0' && 'tw-text-warning',
                  )}
                >
                  ~ {weiToNumberFormat(profit, 4)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </span>
              }
              tooltip={
                <>
                  ~ {weiToNumberFormat(profit, 18)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
            />
          </div>
        </td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <div className="tw-truncate">
            {toNumberFormat(getInterestAPR(item), 2)}%
          </div>
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-end">
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
}

export function OpenPositionRow({ item }: IOpenPositionRowInnerProps) {
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
}

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

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { ActionButton } from 'app/components/Form/ActionButton';
import { ActiveLoan } from 'types/active-loan';
import { translations } from 'locales/i18n';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPosition } from 'types/trading-position';
import {
  calculateLiquidation,
  formatAsBTCPrice,
  toNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { weiTo18, fromWei } from 'utils/blockchain/math-helpers';
import { leverageFromMargin } from 'utils/blockchain/leverage-from-start-margin';
import { AddToMarginDialog } from '../AddToMarginDialog';
import { ClosePositionDialog } from '../ClosePositionDialog';
import { CurrentPositionProfit } from 'app/components/CurrentPositionProfit';
import { PositionBlock } from './PositionBlock';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { LoadableValue } from 'app/components/LoadableValue';

interface IOpenPositionRowProps {
  item: ActiveLoan;
}

export function OpenPositionRow({ item }: IOpenPositionRowProps) {
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
  const amount = bignumber(item.collateral).div(leverage).toFixed(0);
  const liquidationPrice = useMemo(
    () =>
      toNumberFormat(
        calculateLiquidation(
          isLong,
          leverage,
          item.maintenanceMargin,
          item.startRate,
        ),
        4,
      ),
    [item, isLong, leverage],
  );
  const collateralAssetDetails = AssetsDictionary.get(collateralAsset);
  const startPrice = formatAsBTCPrice(item.startRate, isLong);

  if (pair === undefined) return <></>;

  return (
    <tr>
      <td>
        <PositionBlock position={position} name={pair.name} />
      </td>
      <td className="tw-hidden xl:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          <LoadableValue
            value={
              <>
                {weiToNumberFormat(item.collateral, 4)}{' '}
                <AssetRenderer asset={collateralAssetDetails.asset} /> (
                {leverage}x)
              </>
            }
            loading={false}
            tooltip={
              <>
                {weiTo18(item.collateral)}{' '}
                <AssetRenderer asset={collateralAssetDetails.asset} /> (
                {leverage}x)
              </>
            }
          />
        </div>
      </td>
      <td className="tw-hidden xl:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          {toNumberFormat(getEntryPrice(item, position), 4)}{' '}
          <AssetRenderer asset={pair.longDetails.asset} />
        </div>
      </td>
      <td className="tw-hidden md:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          {liquidationPrice} <AssetRenderer asset={pair.longDetails.asset} />
        </div>
      </td>
      <td className="tw-hidden xl:tw-table-cell">
        <div className="tw-truncate">
          <LoadableValue
            value={
              <>
                {weiToNumberFormat(amount, 4)}{' '}
                <AssetRenderer asset={collateralAssetDetails.asset} />
              </>
            }
            loading={false}
            tooltip={
              <>
                {weiTo18(amount)}{' '}
                <AssetRenderer asset={collateralAssetDetails.asset} />
              </>
            }
          />
          {collateralAsset !== pair.shortAsset && (
            <div>
              ≈ {weiToNumberFormat(item.startRate, 6)}{' '}
              <AssetRenderer asset={pair.shortDetails.asset} />
            </div>
          )}

          {collateralAsset === pair.shortAsset && (
            <div>
              ≈{' '}
              {toNumberFormat(
                Number(fromWei(amount)) * getEntryPrice(item, position),
                6,
              )}{' '}
              <AssetRenderer asset={pair.longDetails.asset} />
            </div>
          )}
        </div>
      </td>
      <td className="tw-hidden sm:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          <CurrentPositionProfit
            source={loanAsset}
            destination={collateralAsset}
            amount={item.collateral}
            startPrice={startPrice}
            isLong={isLong}
          />
        </div>
      </td>
      <td className="tw-hidden 2xl:tw-table-cell">
        <div className="tw-truncate">
          {toNumberFormat(getInterestAPR(item), 2)}%
        </div>
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
          <ActionButton
            text={t(translations.openPositionTable.cta.margin)}
            onClick={() => setShowAddToMargin(true)}
            className={`tw-border-none tw-pl-0 tw-pr-4 xl:tw-pr-2 2xl:tw-pr-5 ${
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
            className={`tw-border-none tw-ml-0 tw-pl-0 ${
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
          positionSize={weiToNumberFormat(item.collateral, 4)}
          liquidationPrice={
            <>
              {liquidationPrice}{' '}
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
  );
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

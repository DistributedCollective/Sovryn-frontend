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
  calculateLiquidation,
  formatAsBTCPrice,
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import { AddToMarginDialog } from '../AddToMarginDialog';
import { ClosePositionDialog } from '../ClosePositionDialog';
import { CurrentPositionProfit } from '../../../../components/CurrentPositionProfit';
import { PositionBlock } from './PositionBlock';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { useMaintenance } from 'app/hooks/useMaintenance';

interface Props {
  item: ActiveLoan;
}

export function OpenPositionRow({ item }: Props) {
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
    pair.longAsset === loanAsset ? TradingPosition.LONG : TradingPosition.SHORT;

  const isLong = position === TradingPosition.LONG;
  const leverage = leverageFromMargin(item.startMargin);

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
  if (pair === undefined) return <></>;

  const collateralAssetDetails = AssetsDictionary.get(collateralAsset);

  const startPrice = formatAsBTCPrice(item.startRate, isLong);

  const amount = bignumber(item.collateral).div(leverage).toFixed(0);

  return (
    <>
      <tr>
        <td>
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td>
          <div className="tw-whitespace-nowrap">
            {weiToNumberFormat(item.collateral, 4)}{' '}
            <AssetRenderer asset={collateralAssetDetails.asset} />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            {toNumberFormat(getEntryPrice(item, position), 4)}{' '}
            <AssetRenderer asset={pair.longDetails.asset} />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            {liquidationPrice} <AssetRenderer asset={pair.longDetails.asset} />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            {weiToNumberFormat(amount, 4)}{' '}
            <AssetRenderer asset={pair.shortDetails.asset} /> ({leverage}x)
          </div>
        </td>
        <td>
          <div className="tw-whitespace-nowrap">
            <CurrentPositionProfit
              loanId={item.loanId}
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
    </>
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

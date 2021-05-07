import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { ActionButton } from 'form/ActionButton';
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

interface Props {
  item: ActiveLoan;
}

export function OpenPositionRow({ item }: Props) {
  const { t } = useTranslation();
  const [showAddToMargin, setShowAddToMargin] = useState(false);
  const [showClosePosition, setShowClosePosition] = useState(false);

  const loanAsset = assetByTokenAddress(item.loanToken);
  const collateralAsset = assetByTokenAddress(item.collateralToken);

  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);
  if (pair === undefined) return <></>;

  const position =
    pair.longAsset === loanAsset ? TradingPosition.LONG : TradingPosition.SHORT;

  const isLong = position === TradingPosition.LONG;

  const collateralAssetDetails = AssetsDictionary.get(collateralAsset);

  const startPrice = formatAsBTCPrice(item.startRate, isLong);
  const leverage = leverageFromMargin(item.startMargin);

  const amount = bignumber(item.collateral).div(leverage).toFixed(0);

  return (
    <>
      <tr>
        <td>
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td>
          <div className="tw-truncate">
            {weiToNumberFormat(item.collateral, 4)}{' '}
            <AssetRenderer asset={collateralAssetDetails.asset} />
          </div>
          {/*<div>≈ xxxxxx USD</div>*/}
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            {toNumberFormat(getEntryPrice(item, position), 4)}{' '}
            <AssetRenderer asset={pair.longDetails.asset} />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            {toNumberFormat(
              calculateLiquidation(
                isLong,
                leverageFromMargin(item.startMargin),
                item.maintenanceMargin,
                item.startRate,
              ),
              4,
            )}{' '}
            <AssetRenderer asset={pair.longDetails.asset} />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            {weiToNumberFormat(item.currentMargin, 4)}% ({leverage}x)
          </div>
        </td>
        <td>
          <div className="tw-truncate">
            <CurrentPositionProfit
              source={loanAsset}
              destination={collateralAsset}
              amount={amount}
              startPrice={startPrice}
              isLong={isLong}
            />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            {toNumberFormat(getInterestAPR(item), 2)}%
          </div>
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-end tw-space-x-4">
            <ActionButton
              text={t(translations.openPositionTable.cta.margin)}
              onClick={() => setShowAddToMargin(true)}
            />
            <ActionButton
              text={t(translations.openPositionTable.cta.close)}
              onClick={() => setShowClosePosition(true)}
            />
          </div>
          <AddToMarginDialog
            item={item}
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

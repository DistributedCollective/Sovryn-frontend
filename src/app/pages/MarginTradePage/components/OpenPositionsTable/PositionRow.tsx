import { AssetRenderer } from 'app/components/AssetRenderer';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { ActionButton } from 'app/components/Form/ActionButton';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { LoadableValue } from 'app/components/LoadableValue';
import { usePositionLiquidationPrice } from 'app/hooks/trading/usePositionLiquidationPrice';
import { useMaintenance } from 'app/hooks/useMaintenance';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { bignumber } from 'mathjs';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActiveLoan } from 'types/active-loan';
import { TradingPosition } from 'types/trading-position';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { leverageFromMargin } from 'utils/blockchain/leverage-from-start-margin';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToAssetNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { EventType } from '../../types';
import { isLongTrade } from '../../utils/marginUtils';
import { AddToMarginDialog } from '../AddToMarginDialog';
import { ClosePositionDialog } from '../ClosePositionDialog';
import { PositionEventsTable } from '../PositionEventsTable';
import { PositionBlock } from '../PositionBlock';
import { useMargin_getLoanEvents } from './hooks/useMargin_getLoanEvents';
import { ProfitContainer } from './ProfitContainer';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';

type PositionRowProps = {
  data: ActiveLoan;
  events?: any[];
};

export const PositionRow: React.FC<PositionRowProps> = ({ data: item }) => {
  const { items: events, loading } = useMargin_getLoanEvents(item.loanId);

  const { t } = useTranslation();

  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.CLOSE_MARGIN_TRADES]: closeTradesLocked,
    [States.ADD_TO_MARGIN_TRADES]: addToMarginLocked,
  } = checkMaintenances();

  const [showAddToMargin, setShowAddToMargin] = useState(false);
  const [showClosePosition, setShowClosePosition] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  const tradeEvent = useMemo(
    () => events.data.find(item => item.event === EventType.TRADE),
    [events],
  );

  const rolloverDate = useMemo(
    () => new Date(events.nextRollover).getTime().toString(),
    [events],
  );

  return (
    <>
      <tr>
        <td>
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td>
          <div className="tw-whitespace-nowrap">
            <div className="tw-whitespace-nowrap">
              <LoadableValue
                value={
                  <>
                    {weiToAssetNumberFormat(item.collateral, collateralAsset)}{' '}
                    <AssetRenderer asset={collateralAsset} /> ({leverage}x)
                  </>
                }
                tooltip={weiToNumberFormat(item.collateral, 18)}
              />
            </div>
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
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
        <td className="tw-hidden xl:tw-table-cell">
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
        <td className="tw-hidden xl:tw-table-cell">
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
                  {weiToNumberFormat(positionMargin, 18)}
                  <br />
                  {weiToNumberFormat(item.currentMargin, 3)} %
                </>
              }
            />
          </div>
        </td>
        <td>
          <div className="tw-whitespace-nowrap">
            <ProfitContainer
              item={item}
              position={position}
              entryPrice={entryPrice}
              leverage={leverage}
            />
          </div>
        </td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <div
            className={classNames('tw-min-w-6', { 'bp3-skeleton': loading })}
          >
            {tradeEvent?.interestRate ? (
              <>{tradeEvent.interestRate.toFixed(2)}%</>
            ) : (
              '-'
            )}
          </div>
        </td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <div
            className={classNames('tw-min-w-6', { 'bp3-skeleton': loading })}
          >
            {events.nextRollover ? (
              <DisplayDate timestamp={rolloverDate} />
            ) : (
              <>-</>
            )}
          </div>
        </td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <div
            className={classNames('tw-min-w-6', { 'bp3-skeleton': loading })}
          >
            {tradeEvent?.txHash ? (
              <LinkToExplorer
                txHash={tradeEvent.txHash}
                className="tw-m-0 tw-whitespace-nowrap"
                startLength={5}
                endLength={5}
              />
            ) : (
              <>-</>
            )}
          </div>
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-end">
            <ActionButton
              text={t(translations.openPositionTable.cta.margin)}
              onClick={() => setShowAddToMargin(true)}
              className={`tw-border-none tw-px-1 sm:tw-px-4 xl:tw-px-2 ${
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
              dataActionId="margin-openPosition-history-addToMarginButton"
            />
            <ActionButton
              text={t(translations.openPositionTable.cta.close)}
              onClick={() => setShowClosePosition(true)}
              className={`tw-border-none tw-px-1 sm:tw-px-4 xl:tw-px-2 ${
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
              dataActionId="margin-openPosition-history-closeButton"
            />
            <ActionButton
              text={t(translations.openPositionTable.cta.details)}
              onClick={() => setShowDetails(!showDetails)}
              className="tw-border-none tw-ml-0 tw-pl-1 sm:tw-p-4 xl:tw-pl-2 tw-pr-0"
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={events.data.length === 0}
              data-action-id="margin-openPositions-DetailsButton"
              loading={loading}
            />
          </div>
          <AddToMarginDialog
            item={item}
            liquidationPrice={
              <>
                {toAssetNumberFormat(Number(liquidationPrice), pair.longAsset)}
                &nbsp;&nbsp;
                <AssetRenderer asset={pair.longAsset} />
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

      {showDetails && (
        <PositionEventsTable
          isOpenPosition={true}
          events={events.data}
          isLong={isLong}
        />
      )}
    </>
  );
};

const getEntryPrice = (item: ActiveLoan, position: TradingPosition) => {
  if (position === TradingPosition.LONG) return Number(weiTo18(item.startRate));
  return 1 / Number(weiTo18(item.startRate));
};

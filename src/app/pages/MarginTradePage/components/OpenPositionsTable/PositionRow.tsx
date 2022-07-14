import React, { useEffect, useMemo, useState } from 'react';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { ActionButton } from 'app/components/Form/ActionButton';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { LoadableValue } from 'app/components/LoadableValue';
import { usePositionLiquidationPrice } from 'app/hooks/trading/usePositionLiquidationPrice';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { translations } from 'locales/i18n';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { TradingPosition } from 'types/trading-position';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { getOpenPositionPrice, isLongTrade } from '../../utils/marginUtils';
import { AddToMarginDialog } from '../AddToMarginDialog';
import { ClosePositionDialog } from '../ClosePositionDialog';
import { PositionEventsTable } from '../PositionEventsTable';
import { PositionBlock } from '../PositionBlock';
import { ProfitContainer } from './ProfitContainer';
import { MAINTENANCE_MARGIN } from 'utils/classifiers';
import { useGetLoan } from 'app/hooks/trading/useGetLoan';
import { toWei, weiTo18 } from 'utils/blockchain/math-helpers';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { MarginLoansFieldsFragment } from 'utils/graphql/rsk/generated';

type PositionRowProps = {
  event: MarginLoansFieldsFragment;
};

export const PositionRow: React.FC<PositionRowProps> = ({ event }) => {
  const { t } = useTranslation();
  const [showAddToMargin, setShowAddToMargin] = useState(false);
  const [showClosePosition, setShowClosePosition] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { id, trade, loanToken, nextRollover, collateralToken } = event;

  const entryLeverage = trade?.[0].entryLeverage || '1';
  const interestRate = trade?.[0].interestRate || '0';
  const entryPrice = trade?.[0].entryPrice || '0';
  const transaction = trade?.[0].transaction.id || '';
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.CLOSE_MARGIN_TRADES]: closeTradesLocked,
    [States.ADD_TO_MARGIN_TRADES]: addToMarginLocked,
  } = checkMaintenances();
  const { value: loan, loading, getLoan } = useGetLoan();
  const loanAsset = assetByTokenAddress(loanToken.id);
  const collateralAsset = assetByTokenAddress(collateralToken.id);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);
  const position = useMemo(() => {
    return pair.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;
  }, [loanAsset, pair]);

  const isLong = useMemo(() => isLongTrade(position), [position]);
  const leverage = useMemo(() => Number(entryLeverage) + 1, [entryLeverage]);
  const openPrice = useMemo(() => getOpenPositionPrice(entryPrice, position), [
    entryPrice,
    position,
  ]);

  const rolloverDate = useMemo(() => {
    if (nextRollover) {
      const date = new Date(nextRollover).getTime().toString();
      return <DisplayDate timestamp={date} />;
    }
    return '-';
  }, [nextRollover]);

  useEffect(() => {
    getLoan(id);
  }, [id, getLoan]);

  const principal = useMemo(() => {
    return loan ? loan.principal : '0';
  }, [loan]);

  const currentMargin = useMemo(() => {
    return loan ? loan.currentMargin : '0';
  }, [loan]);

  const positionSize = useMemo(() => {
    return loan ? weiTo18(loan.collateral) : '0';
  }, [loan]);

  const liquidationPrice = usePositionLiquidationPrice(
    principal,
    toWei(positionSize),
    position,
    MAINTENANCE_MARGIN,
  );

  const positionMargin = useMemo(() => {
    return bignumber(1)
      .div(entryPrice)
      .mul(bignumber(positionSize).div(leverage))
      .toString();
  }, [entryPrice, positionSize, leverage]);

  const positionMarginAsset = useMemo(
    () => (isLong ? pair.longAsset : pair.shortAsset),
    [isLong, pair],
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
                    <AssetValue
                      asset={collateralAsset}
                      value={toWei(positionSize)}
                      useTooltip
                    />{' '}
                    ({leverage}x)
                  </>
                }
              />
            </div>
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              value={
                <AssetValue
                  asset={pair.longDetails.asset}
                  value={toWei(openPrice)}
                  useTooltip
                />
              }
            />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <LoadableValue
              value={
                <>
                  <AssetValue
                    asset={pair.longDetails.asset}
                    value={toWei(liquidationPrice)}
                    useTooltip
                  />
                </>
              }
              loading={loading}
            />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            <LoadableValue
              value={
                <AssetValue
                  asset={positionMarginAsset}
                  value={toWei(positionMargin)}
                />
              }
              loading={loading}
              tooltip={
                <>
                  {toNumberFormat(positionMargin, 18)}{' '}
                  <AssetSymbolRenderer asset={positionMarginAsset} />
                  <br />
                  {weiToNumberFormat(currentMargin, 3)} %
                </>
              }
            />
          </div>
        </td>
        <td>
          <div className="tw-whitespace-nowrap">
            <ProfitContainer
              item={event}
              position={position}
              leverage={leverage}
            />
          </div>
        </td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <div className="tw-min-w-6">
            <>{Number(interestRate).toFixed(2)}%</>
          </div>
        </td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <div className="tw-min-w-6">{rolloverDate}</div>
        </td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <div className="tw-min-w-6">
            <LinkToExplorer
              txHash={transaction}
              className="tw-m-0 tw-whitespace-nowrap"
              startLength={5}
              endLength={5}
            />
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
              loading={loading}
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={addToMarginLocked || currentMargin === '0' || loading}
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
              loading={loading}
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={closeTradesLocked || currentMargin === '0' || loading}
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
              data-action-id="margin-openPositions-DetailsButton"
            />
          </div>
          <AddToMarginDialog
            item={event}
            onCloseModal={() => setShowAddToMargin(false)}
            showModal={showAddToMargin}
          />
          <ClosePositionDialog
            item={event}
            onCloseModal={() => setShowClosePosition(false)}
            showModal={showClosePosition}
          />
        </td>
      </tr>

      {showDetails && (
        <PositionEventsTable
          isOpenPosition={true}
          event={event}
          isLong={isLong}
          position={position}
        />
      )}
    </>
  );
};

import React, { useMemo, useState } from 'react';
import type { OpenLoanType } from 'types/active-loan';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPosition } from 'types/trading-position';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToAssetNumberFormat,
} from 'utils/display-text/format';
import { Tooltip } from '@blueprintjs/core';
import { PositionBlock } from '../PositionBlock';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { TradeProfit } from 'app/components/TradeProfit';
import { getTradingPositionPrice } from '../../utils/marginUtils';
import { ActionButton } from 'app/components/Form/ActionButton';
import { useTranslation } from 'react-i18next';
import { LiquidatedPositionsTable } from '../LiquidatedPositionsTable';
import { translations } from 'locales/i18n';
import { EventType } from '../../types';

type ClosedPositionRowProps = {
  items: OpenLoanType[];
};

export const ClosedPositionRow: React.FC<ClosedPositionRowProps> = ({
  items,
}) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const liquidateLoans = useMemo(
    () => items.filter(loan => loan.event === EventType.LIQUIDATE),
    [items],
  );
  const closedItem = useMemo(() => items[items.length - 1], [items]);
  const openedItem = useMemo(() => items[0], [items]);
  const loanAsset = assetByTokenAddress(closedItem.loanToken);
  const collateralAsset = assetByTokenAddress(closedItem.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);
  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;
  const leverage = useMemo(() => openedItem.leverage + 1, [
    openedItem.leverage,
  ]);
  const openPrice = useMemo(
    () => getTradingPositionPrice(openedItem, position),
    [openedItem, position],
  );
  const closePrice = useMemo(
    () => getTradingPositionPrice(closedItem, position),
    [closedItem, position],
  );

  return (
    <>
      <tr>
        <td>
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            {weiToAssetNumberFormat(
              closedItem.positionSizeChange,
              collateralAsset,
            )}{' '}
            <AssetRenderer asset={collateralAsset} />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div>{leverage}x</div>
        </td>
        <td className="tw-hidden md:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <Tooltip
              content={
                <>
                  {toNumberFormat(openPrice, 18)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
            >
              <>
                {toAssetNumberFormat(openPrice, pair.longDetails.asset)}{' '}
                <AssetRenderer asset={pair.longDetails.asset} />
              </>
            </Tooltip>
          </div>
        </td>
        <td className="tw-hidden md:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <Tooltip
              content={
                <>
                  {toNumberFormat(closePrice, 18)}{' '}
                  <AssetRenderer asset={pair.longDetails.asset} />
                </>
              }
            >
              <>
                {toAssetNumberFormat(closePrice, pair.longDetails.asset)}{' '}
                <AssetRenderer asset={pair.longDetails.asset} />
              </>
            </Tooltip>
          </div>
        </td>
        <td>
          <TradeProfit closedItem={closedItem} openedItem={openedItem} />
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <LinkToExplorer
            className="tw-text-primary tw-truncate tw-m-0"
            txHash={openedItem.txHash}
            startLength={5}
            endLength={5}
          />
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <LinkToExplorer
            className="tw-text-primary tw-truncate tw-m-0"
            txHash={closedItem.txHash}
            startLength={5}
            endLength={5}
          />
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
            <ActionButton
              text={t(translations.tradingHistoryPage.table.cta.details)}
              onClick={() => setShowDetails(!showDetails)}
              className="tw-border-none tw-ml-0 tw-pl-4 xl:tw-pl-2 tw-pr-0"
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={liquidateLoans.length === 0}
              data-action-id="margin-openPositions-DetailsButton"
            />
          </div>
        </td>
      </tr>
      {showDetails && liquidateLoans && (
        <LiquidatedPositionsTable
          isOpenPosition={false}
          liquidateLoans={liquidateLoans}
          isLong={position === TradingPosition.LONG}
        />
      )}
    </>
  );
};

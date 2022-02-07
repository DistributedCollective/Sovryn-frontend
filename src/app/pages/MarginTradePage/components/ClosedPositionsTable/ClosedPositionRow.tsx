import React, { useMemo } from 'react';
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

type ClosedPositionRowProps = {
  closedItem: OpenLoanType;
  openedItem: OpenLoanType;
};

export const ClosedPositionRow: React.FC<ClosedPositionRowProps> = ({
  closedItem,
  openedItem,
}) => {
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
        <td className="tw-w-full">
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            {weiToAssetNumberFormat(
              closedItem.positionSizeChange,
              collateralAsset,
            )}{' '}
            <AssetRenderer asset={collateralAsset} />
          </div>
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div>{leverage}x</div>
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
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
        <td className="tw-w-full tw-hidden md:tw-table-cell">
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
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <TradeProfit
            closedItem={closedItem}
            openedItem={openedItem}
            // positionSize={closedItem.positionSizeChange}
            // pair={pair}
            // loanId={closedItem.loanId}
            // loanToken={closedItem.loanToken}
            // closePrice={closePrice}
            // entryPrice={openPrice}
            // position={position}
            // asset={collateralAsset}
          />
        </td>
        <td className="tw-w-full tw-hidden 2xl:tw-table-cell">
          <LinkToExplorer
            txHash={openedItem.txHash}
            className="tw-text-primary tw-truncate"
            startLength={5}
            endLength={5}
          />
        </td>
        <td className="tw-w-full tw-hidden 2xl:tw-table-cell">
          <LinkToExplorer
            txHash={closedItem.txHash}
            className="tw-text-primary tw-truncate"
            startLength={5}
            endLength={5}
          />
        </td>
      </tr>
    </>
  );
};

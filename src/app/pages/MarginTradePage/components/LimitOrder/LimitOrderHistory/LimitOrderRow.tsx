import React, { useMemo } from 'react';

import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { TradingPosition } from 'types/trading-position';
import { PositionBlock } from '../../PositionBlock';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Tooltip } from '@blueprintjs/core';
import { fromWei } from 'web3-utils';
interface IOpenPositionRowProps {
  item: MarginLimitOrder;
}

export const LimitOrderRow: React.FC<IOpenPositionRowProps> = ({ item }) => {
  const loanAsset = assetByTokenAddress(item.loanTokenAddress);
  const collateralAsset = assetByTokenAddress(item.collateralTokenAddress);

  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const leverage = useMemo(
    () => Number(fromWei(item.leverageAmount.toString())) + 1,
    [item.leverageAmount],
  );

  const entryPrice = useMemo(() => fromWei(item.minEntryPrice.toString()), [
    item.minEntryPrice,
  ]);

  const tradeAmount = useMemo(
    () =>
      item.loanTokenSent.toString() !== '0'
        ? item.loanTokenSent.toString()
        : item.collateralTokenSent.toString(),
    [item.loanTokenSent, item.collateralTokenSent],
  );

  if (!pair) return null;

  const borrowToken = pair.getBorrowAssetForPosition(position);

  return (
    <tr>
      <td>
        <DisplayDate
          timestamp={new Date(item.createdTimestamp.toNumber())
            .getTime()
            .toString()}
        />
      </td>

      <td className="tw-w-full">
        <PositionBlock position={position} name={pair.name} />
      </td>
      <td className="tw-w-full tw-hidden xl:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          <Tooltip
            content={
              <>
                {toNumberFormat(entryPrice, 18)}{' '}
                <AssetRenderer asset={borrowToken} />
              </>
            }
          >
            <>
              {toAssetNumberFormat(entryPrice, borrowToken)}{' '}
              <AssetRenderer asset={borrowToken} />
            </>
          </Tooltip>
        </div>
      </td>

      <td className="tw-w-full">
        {weiToNumberFormat(tradeAmount, 6)} ({leverage}x){' '}
        <AssetRenderer asset={collateralAsset} />
      </td>

      <td>
        <DisplayDate
          timestamp={new Date(item.deadline.toNumber()).getTime().toString()}
        />
      </td>

      <td>{weiToNumberFormat(item.filledAmount, 6)}</td>
    </tr>
  );
};

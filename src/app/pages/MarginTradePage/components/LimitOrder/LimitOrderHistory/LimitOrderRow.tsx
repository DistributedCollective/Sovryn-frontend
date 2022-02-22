import React, { useMemo } from 'react';

import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { PositionBlock } from '../../PositionBlock';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Tooltip } from '@blueprintjs/core';
import { fromWei } from 'web3-utils';
import { MarginLimitOrderList } from '../LimitOrderTables';
import { bignumber } from 'mathjs';

interface IOpenPositionRowProps extends MarginLimitOrderList {}

export const LimitOrderRow: React.FC<IOpenPositionRowProps> = ({
  collateralAsset,
  pair,
  position,
  leverage,
  loanTokenSent,
  collateralTokenSent,
  minEntryPrice,
  createdTimestamp,
  deadline,
  filledAmount,
}) => {
  const tradeAmount = useMemo(
    () =>
      loanTokenSent.toString() !== '0'
        ? loanTokenSent.toString()
        : collateralTokenSent.toString(),
    [loanTokenSent, collateralTokenSent],
  );
  const loanToken = pair?.getAssetForPosition(position);

  const entryPrice = useMemo(() => fromWei(minEntryPrice.toString()), [
    minEntryPrice,
  ]);

  const minEntry = useMemo(() => {
    if (pair?.longAsset === loanToken) {
      if (!entryPrice || Number(entryPrice) === 0) return '';
      return bignumber(1).div(entryPrice).toFixed(8);
    }
    return entryPrice;
  }, [entryPrice, loanToken, pair?.longAsset]);

  return (
    <tr>
      <td>
        <DisplayDate timestamp={createdTimestamp.getTime().toString()} />
      </td>

      <td className="tw-w-full">
        <PositionBlock position={position} name={pair.name} />
      </td>
      <td className="tw-w-full tw-hidden xl:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          <Tooltip
            content={
              <>
                {toNumberFormat(minEntry, 18)}{' '}
                <AssetRenderer asset={pair.longAsset} />
              </>
            }
          >
            <>
              {toAssetNumberFormat(minEntry, pair.longAsset)}{' '}
              <AssetRenderer asset={pair.longAsset} />
            </>
          </Tooltip>
        </div>
      </td>

      <td className="tw-w-full">
        {weiToNumberFormat(tradeAmount, 6)} ({leverage}x){' '}
        <AssetRenderer asset={collateralAsset} />
      </td>

      <td>
        <DisplayDate timestamp={deadline.getTime().toString()} />
      </td>

      <td>{weiToNumberFormat(filledAmount, 6)}</td>
    </tr>
  );
};

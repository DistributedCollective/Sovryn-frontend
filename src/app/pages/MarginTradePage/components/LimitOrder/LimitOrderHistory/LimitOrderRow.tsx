import React from 'react';

import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { PositionBlock } from '../../PositionBlock';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Tooltip } from '@blueprintjs/core';
import { MarginLimitOrderList } from '../LimitOrderTables';
import { useGetLimitOrderRow } from 'app/pages/MarginTradePage/hooks/useGetLimitOrderRow';

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
  const { tradeAmount, minEntry } = useGetLimitOrderRow(
    pair,
    position,
    loanTokenSent,
    collateralTokenSent,
    minEntryPrice,
  );

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

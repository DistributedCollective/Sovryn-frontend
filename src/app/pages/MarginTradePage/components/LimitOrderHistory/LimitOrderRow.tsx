import React, { useMemo } from 'react';
import {
  weiToAssetNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { MarginLimitOrder } from '../../types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { TradingPosition } from 'types/trading-position';
import { isLongTrade } from '../OpenPositionsTable/helpers';
import { PositionBlock } from '../OpenPositionsTable/PositionBlock';
import { LoadableValue } from 'app/components/LoadableValue';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

interface ILimitOrderRowProps {
  item: MarginLimitOrder;
  pending?: boolean;
}

export function LimitOrderRow({ item, pending }: ILimitOrderRowProps) {
  const loanAsset = AssetsDictionary.getByLoanContractAddress(
    item.loanTokenAddress,
  ).asset;

  const collateralAsset = assetByTokenAddress(item.collateralTokenAddress);

  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;
  const isLong = useMemo(() => isLongTrade(position), [position]);

  const leverage = weiToNumberFormat(item.leverageAmount.toString());

  const amount = item.collateralTokenSent.div(leverage).toNumber();

  const positionMarginAsset = useMemo(
    () => (isLong ? pair?.longAsset : pair?.shortAsset),
    [isLong, pair],
  );

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
        <PositionBlock position={position} name={pair?.name} />
      </td>

      <td className="tw-w-full tw-hidden xl:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          <LoadableValue
            value={
              <>
                {weiToAssetNumberFormat(
                  item.collateralTokenSent.toString(),
                  collateralAsset,
                )}{' '}
                <AssetRenderer asset={collateralAsset} /> ({leverage}x)
              </>
            }
            loading={false}
            tooltip={
              <>
                {weiTo18(item.collateralTokenSent.toString())}{' '}
                <AssetRenderer asset={collateralAsset} /> ({leverage}x)
              </>
            }
          />
        </div>
      </td>

      <td className="tw-w-full tw-hidden xl:tw-table-cell">
        <div className="tw-truncate">
          <LoadableValue
            value={
              <>
                {weiToNumberFormat(amount, 8)}{' '}
                <AssetRenderer asset={collateralAsset} />
              </>
            }
            loading={false}
            tooltip={
              <>
                {weiTo18(amount)} <AssetRenderer asset={collateralAsset} />
              </>
            }
          />
        </div>
      </td>
      <td>
        <DisplayDate
          timestamp={new Date(item.deadline.toNumber()).getTime().toString()}
        />
      </td>
      <td>-</td>
    </tr>
  );
}

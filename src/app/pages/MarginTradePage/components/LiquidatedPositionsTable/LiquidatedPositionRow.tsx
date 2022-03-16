import React, { useMemo } from 'react';
import type { OpenLoanType } from 'types/active-loan';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import dayjs from 'dayjs';
import { weiToAssetNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { bignumber } from 'mathjs';
import { toWei } from 'utils/blockchain/math-helpers';

type LiquidatedPositionRowProps = {
  liquidatedLoan: OpenLoanType;
  positionStatus: boolean;
  isLong: boolean;
};

export const LiquidatedPositionRow: React.FC<LiquidatedPositionRowProps> = ({
  liquidatedLoan,
  isLong,
}) => {
  const loanAsset = assetByTokenAddress(liquidatedLoan.loanToken);
  const collateralAsset = assetByTokenAddress(liquidatedLoan.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const collateralToLoanRate = useMemo(() => {
    if (isLong) {
      return liquidatedLoan.collateralToLoanRate;
    }
    return toWei(
      bignumber(1)
        .div(liquidatedLoan.collateralToLoanRate)
        .mul(10 ** 18)
        .toString(),
    );
  }, [isLong, liquidatedLoan.collateralToLoanRate]);

  return (
    <tr>
      <td>{liquidatedLoan.event}</td>
      <td className="tw-hidden md:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          -
          {weiToAssetNumberFormat(
            liquidatedLoan.positionSizeChange,
            collateralAsset,
          )}{' '}
          <AssetRenderer asset={collateralAsset} />
        </div>
      </td>
      <td>
        <div className="tw-whitespace-nowrap">
          {weiToAssetNumberFormat(collateralToLoanRate, pair.longAsset)}{' '}
          <AssetRenderer asset={pair.longAsset} />
        </div>
      </td>
      <td className="tw-hidden md:tw-table-cell">
        {dayjs(liquidatedLoan.time * 1e3).format('DD/MM/YYYY')}
      </td>
      <td className="tw-hidden sm:tw-table-cell">
        <LinkToExplorer
          txHash={liquidatedLoan.txHash}
          className="tw-text-primary tw-truncate tw-m-0"
          startLength={5}
          endLength={5}
        />
      </td>
    </tr>
  );
};

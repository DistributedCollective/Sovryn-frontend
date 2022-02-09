import React from 'react';
import type { OpenLoanType } from 'types/active-loan';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import dayjs from 'dayjs';
import { weiToAssetNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { Tooltip } from '@blueprintjs/core';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';

type LiquidatedPositionRowProps = {
  liquidatedLoan: OpenLoanType;
};

export const LiquidatedPositionRow: React.FC<LiquidatedPositionRowProps> = ({
  liquidatedLoan,
}) => {
  const loanAsset = assetByTokenAddress(liquidatedLoan.loanToken);
  const collateralAsset = assetByTokenAddress(liquidatedLoan.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  return (
    <tr>
      <td>{liquidatedLoan.event}</td>
      <td>
        <div className="tw-whitespace-nowrap">
          {weiToAssetNumberFormat(
            liquidatedLoan.borrowedAmountChange,
            collateralAsset,
          )}{' '}
          <AssetRenderer asset={collateralAsset} />
        </div>
      </td>
      <td>
        <div className="tw-whitespace-nowrap">
          {weiToAssetNumberFormat(
            liquidatedLoan.positionSizeChange,
            collateralAsset,
          )}{' '}
          <AssetRenderer asset={loanAsset} />
        </div>
      </td>
      <td>
        <div className="tw-whitespace-nowrap">
          <Tooltip
            content={
              <>
                {weiToAssetNumberFormat(
                  liquidatedLoan.collateralToLoanRate,
                  pair.longDetails.asset,
                )}{' '}
                <AssetRenderer asset={pair.longDetails.asset} />
              </>
            }
          >
            <>
              {weiToAssetNumberFormat(
                liquidatedLoan.collateralToLoanRate,
                pair.longDetails.asset,
              )}{' '}
              <AssetRenderer asset={pair.longDetails.asset} />
            </>
          </Tooltip>
        </div>
      </td>
      <td>{dayjs(liquidatedLoan.time * 1e3).format('DD/MM/YYYY')}</td>
      <td>
        <LinkToExplorer
          txHash={liquidatedLoan.txHash}
          className="tw-text-primary tw-truncate"
          startLength={5}
          endLength={5}
        />
      </td>
    </tr>
  );
};

/**
 *
 * StatsRow
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { StatsRowData } from '../StatsRowData';

interface Props {
  asset: Asset;
}

export function StatsRow(props: Props) {
  const logo = AssetsDictionary.get(props.asset).logoSvg;
  const lendingContract = getLendingContractName(props.asset);

  return (
    <>
      <tr>
        <td className="tw-text-left tw-whitespace-nowrap">
          <img
            className="tw-inline"
            style={{ width: '38px' }}
            src={logo}
            alt={props.asset}
          />
          <strong className="tw-ml-4">{props.asset}</strong>
        </td>

        <td className="tw-text-right tw-whitespace-nowrap">
          <StatsRowData
            contract={lendingContract}
            data="totalAssetSupply"
            displayType="normal"
          />
        </td>

        <td className="tw-text-right tw-whitespace-nowrap">
          <StatsRowData
            contract={lendingContract}
            data="totalAssetBorrow"
            displayType="normal"
          />
        </td>

        <td className="tw-text-right tw-whitespace-nowrap tw-font-semibold">
          <StatsRowData
            contract={lendingContract}
            data="marketLiquidity"
            displayType="normal"
          />
        </td>

        <td className="tw-text-right tw-whitespace-nowrap tw-font-semibold tw-text-gold">
          <StatsRowData
            contract={lendingContract}
            data="supplyInterestRate"
            displayType="percentage"
            prepend="%"
          />
        </td>

        <td className="tw-text-right tw-whitespace-nowrap tw-font-semibold tw-text-gold">
          <StatsRowData
            contract={lendingContract}
            data="borrowInterestRate"
            displayType="percentage"
            prepend="%"
          />
        </td>
      </tr>
    </>
  );
}

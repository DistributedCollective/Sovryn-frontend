/**
 *
 * StatsRow
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { RowData } from './RowData';

interface Props {
  asset: Asset;
}

export function DataRow(props: Props) {
  const logo = AssetsDictionary.get(props.asset).logoSvg;
  const lendingContract = getLendingContractName(props.asset);

  return (
    <tr>
      <td className="tw-text-left tw-whitespace-nowrap tw-py-6">
        <img
          className="tw-inline"
          style={{ height: '30px' }}
          src={logo}
          alt=""
        />{' '}
        <strong className="tw-ml-2">{props.asset}</strong>
      </td>

      <td className="tw-text-left tw-whitespace-nowrap">
        <RowData
          contract={lendingContract}
          data="marketLiquidity"
          displayType="normal"
          prepend={props.asset}
        />
      </td>

      <td className="tw-text-left tw-whitespace-nowrap">
        <RowData
          contract={lendingContract}
          data="supplyInterestRate"
          displayType="percentage"
          prepend="%"
        />
      </td>

      <td className="tw-text-left tw-whitespace-nowrap">
        <RowData
          contract={lendingContract}
          data="borrowInterestRate"
          displayType="percentage"
          prepend="%"
        />
      </td>
    </tr>
  );
}

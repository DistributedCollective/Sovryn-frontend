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
        <td className="text-left text-nowrap">
          <img
            className="d-inline"
            style={{ height: '40px' }}
            src={logo}
            alt=""
          />{' '}
          <strong>{props.asset}</strong>
        </td>

        <td className="text-right text-nowrap">
          <StatsRowData
            contract={lendingContract}
            data="totalAssetSupply"
            displayType="normal"
            prepend={props.asset}
          />
        </td>

        <td className="text-right text-nowrap">
          <StatsRowData
            contract={lendingContract}
            data="totalAssetBorrow"
            displayType="normal"
            prepend={props.asset}
          />
        </td>

        <td className="text-right text-nowrap">
          <StatsRowData
            contract={lendingContract}
            data="marketLiquidity"
            displayType="normal"
            prepend={props.asset}
          />
        </td>

        <td className="text-right text-nowrap">
          <StatsRowData
            contract={lendingContract}
            data="supplyInterestRate"
            displayType="percentage"
            prepend="%"
          />
        </td>

        <td className="text-right text-nowrap">
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

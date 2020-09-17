/**
 *
 * StatsRow
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { getLendingContractName } from '../../../utils/blockchain/contract-helpers';
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
        <td>
          <img
            className="d-inline"
            style={{ height: '40px' }}
            src={logo}
            alt=""
          />{' '}
          {props.asset}
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'totalAssetSupply'}
            displayType={'normal'}
          />{' '}
          {props.asset}
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'totalAssetBorrow'}
            displayType={'normal'}
          />{' '}
          {props.asset}
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'marketLiquidity'}
            displayType={'normal'}
          />{' '}
          {props.asset}
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'tokenPrice'}
            displayType={'normal'}
          />{' '}
          {props.asset}
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'supplyInterestRate'}
            displayType={'percentage'}
          />
          <span className="text-lightGrey">%</span>
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'borrowInterestRate'}
            displayType={'percentage'}
          />
          <span className="text-lightGrey">%</span>
        </td>
      </tr>
    </>
  );
}

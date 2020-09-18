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
        <td className="text-right">
          <img
            className="d-inline"
            style={{ height: '40px' }}
            src={logo}
            alt=""
          />{' '}
          <strong>{props.asset}</strong>
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'totalAssetSupply'}
            displayType={'normal'}
          />{' '}
          <span className="text-lightGrey">{props.asset}</span>
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'totalAssetBorrow'}
            displayType={'normal'}
          />{' '}
          <span className="text-lightGrey">{props.asset}</span>
        </td>

        <td className="text-right">
          <StatsRowData
            contract={lendingContract}
            data={'marketLiquidity'}
            displayType={'normal'}
          />{' '}
          <span className="text-lightGrey">{props.asset}</span>
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

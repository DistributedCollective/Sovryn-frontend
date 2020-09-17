/**
 *
 * StatsRow
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import {
  getLendingContractName,
  getTokenContractName,
} from '../../../utils/blockchain/contract-helpers';
import { fromWei } from 'web3-utils';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';

interface Props {
  asset: Asset;
}

export function StatsRow(props: Props) {
  const logo = AssetsDictionary.get(props.asset).logoSvg;
  const lendingContract = getLendingContractName(props.asset);
  const tokenContract = getTokenContractName(props.asset);

  const { value: totalAssetSupply } = useCacheCallWithValue(
    lendingContract,
    'totalAssetSupply',
    '0',
  );

  const { value: supplyInterestRate } = useCacheCallWithValue(
    lendingContract,
    'supplyInterestRate',
    '0',
  );

  const { value: borrowInterestRate } = useCacheCallWithValue(
    lendingContract,
    'borrowInterestRate',
    '0',
  );

  const { value: totalAssetBorrowed } = useCacheCallWithValue(
    lendingContract,
    'totalAssetBorrow',
    '0',
  );

  const { value: liquidity } = useCacheCallWithValue(
    lendingContract,
    'marketLiquidity',
    'Loading',
  );

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
        <td>
          {parseFloat(weiTo4(totalAssetSupply)).toLocaleString('en')}{' '}
          {props.asset}
        </td>
        <td>
          {parseFloat(weiTo4(totalAssetBorrowed)).toLocaleString('en')}{' '}
          {props.asset}
        </td>
        <td>
          {(
            parseFloat(fromWei(totalAssetSupply)) -
            parseFloat(fromWei(totalAssetBorrowed))
          ).toLocaleString('en', { minimumFractionDigits: 4 })}{' '}
          {props.asset}
        </td>
        <td>{weiTo4(supplyInterestRate)}%</td>
        <td>{weiTo4(borrowInterestRate)}%</td>
      </tr>
    </>
  );
}

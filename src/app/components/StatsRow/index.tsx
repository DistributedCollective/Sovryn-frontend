/**
 *
 * StatsRow
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { getLendingContractName } from '../../../utils/blockchain/contract-helpers';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { LoadableValue } from '../LoadableValue';

interface Props {
  asset: Asset;
}

export function StatsRow(props: Props) {
  const logo = AssetsDictionary.get(props.asset).logoSvg;
  const lendingContract = getLendingContractName(props.asset);

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
    '0',
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
        <td className="text-right">
          <LoadableValue
            value={`${parseFloat(weiTo4(totalAssetSupply)).toLocaleString(
              'en',
              { maximumFractionDigits: 2 },
            )} 
              ${props.asset}`}
            loading={totalAssetSupply === '0' ? true : false}
          />
        </td>
        <td className="text-right">
          <LoadableValue
            value={`${parseFloat(
              weiTo4(totalAssetBorrowed),
            ).toLocaleString('en', { maximumFractionDigits: 2 })} 
          ${props.asset}`}
            loading={totalAssetBorrowed === '0' ? true : false}
          />
        </td>
        <td className="text-right">
          <LoadableValue
            value={`${parseFloat(weiTo4(liquidity)).toLocaleString('en', {
              maximumFractionDigits: 2,
            })}
          ${props.asset}`}
            loading={liquidity === '0' ? true : false}
          />
        </td>
        <td className="text-right">
          {weiTo4(supplyInterestRate)}
          <span className="text-lightGrey">%</span>
        </td>
        <td className="text-right">
          {weiTo4(borrowInterestRate)}
          <span className="text-lightGrey">%</span>
        </td>
      </tr>
    </>
  );
}

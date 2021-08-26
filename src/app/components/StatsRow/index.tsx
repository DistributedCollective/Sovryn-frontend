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
import { useHistory } from 'react-router-dom';

interface Props {
  asset: Asset;
}

export function StatsRow(props: Props) {
  const logo = AssetsDictionary.get(props.asset).logoSvg;
  const lendingContract = getLendingContractName(props.asset);
  const history = useHistory();

  const lend = () => {
    history.push({
      pathname: '/lend',
      state: {
        asset: props.asset,
      },
    });
  };

  const borrow = () => {
    history.push({
      pathname: '/borrow',
      state: {
        asset: props.asset,
      },
    });
  };
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
          <div className="tw-cursor-pointer" onClick={() => lend()}>
            <StatsRowData
              contract={lendingContract}
              data="supplyInterestRate"
              displayType="percentage"
              prepend="%"
            />
          </div>
        </td>

        <td className="tw-text-right tw-whitespace-nowrap tw-font-semibold tw-text-gold">
          <div className="tw-cursor-pointer" onClick={() => borrow()}>
            <StatsRowData
              contract={lendingContract}
              data="borrowInterestRate"
              displayType="percentage"
              prepend="%"
            />
          </div>
        </td>
      </tr>
    </>
  );
}

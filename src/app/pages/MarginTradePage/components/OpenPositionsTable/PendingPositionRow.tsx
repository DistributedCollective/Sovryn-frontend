import React from 'react';

import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';

import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Transaction, TxStatus } from 'store/global/transactions-store/types';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { PositionBlock } from './PositionBlock';

interface Props {
  item: Transaction;
}

export function PendingPositionRow({ item }: Props) {
  const { customData } = item;

  const collateralAssetDetails = AssetsDictionary.get(
    customData?.collateralToken,
  );

  return (
    <>
      <tr>
        <td>
          <PositionBlock
            position={customData?.position}
            name={customData?.pair.name}
          />
        </td>
        <td colSpan={6}>
          <div className="tw-truncate">
            {weiToNumberFormat(customData?.amount, 4)}{' '}
            <AssetRenderer asset={collateralAssetDetails.asset} />
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center justify-content-between col-lg-10 col-md-12 p-0">
            <div>
              {item.status === TxStatus.FAILED && <p className="m-0">Failed</p>}
              {item.status === TxStatus.PENDING && (
                <p className="m-0">Pending</p>
              )}
              <LinkToExplorer
                txHash={item.transactionHash}
                className="text-gold font-weight-normal text-nowrap"
              />
            </div>
            <div>
              {item.status === TxStatus.FAILED && (
                <img src={iconRejected} title="Failed" alt="Failed" />
              )}
              {item.status === TxStatus.PENDING && (
                <img src={iconPending} title="Pending" alt="Pending" />
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

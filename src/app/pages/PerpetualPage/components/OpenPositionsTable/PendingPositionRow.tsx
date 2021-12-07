import React from 'react';

import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';

import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Transaction, TxStatus } from 'store/global/transactions-store/types';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { AssetValue } from '../../../../components/AssetValue';
import { PERPETUAL_CHAIN_ID } from '../../types';

interface IPendingPositionRow {
  item: Transaction;
}

export function PendingPositionRow({ item }: IPendingPositionRow) {
  const { customData } = item;
  const { t } = useTranslation();

  const collateralAssetDetails = AssetsDictionary.get(
    customData?.collateralToken,
  );

  // TODO: implement OpenPositions PendingPositionRow
  return (
    <>
      <tr>
        <td>{customData?.pair.name}</td>
        <td className={'tw-text-right'}>
          <AssetValue
            value={customData?.position}
            asset={customData?.pair.longAsset}
          />
        </td>
        <td colSpan={6}>
          <div className="tw-truncate">
            {weiToNumberFormat(customData?.amount, 4)}{' '}
            <AssetRenderer asset={collateralAssetDetails.asset} />
          </div>
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-between lg:tw-w-5/6 tw-p-0">
            <div>
              {item.status === TxStatus.FAILED && (
                <p className="tw-m-0">{t(translations.common.failed)}</p>
              )}
              {item.status === TxStatus.PENDING && (
                <p className="tw-m-0">{t(translations.common.pending)}</p>
              )}
              <LinkToExplorer
                className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
                txHash={item.transactionHash}
                chainId={PERPETUAL_CHAIN_ID}
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

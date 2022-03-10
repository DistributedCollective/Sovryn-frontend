import React from 'react';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { weiToAssetNumberFormat } from '../../../../../utils/display-text/format';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Transaction, TxStatus } from 'store/global/transactions-store/types';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { PositionBlock } from '../PositionBlock';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

type PendingPositionRowProps = {
  item: Transaction;
};

export function PendingPositionRow({ item }: PendingPositionRowProps) {
  const { customData } = item;
  const { t } = useTranslation();

  return (
    <>
      <tr>
        <td>
          <PositionBlock
            position={customData?.position}
            name={customData?.pair.name}
          />
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            {weiToAssetNumberFormat(
              customData?.positionSize,
              customData?.collateral,
            )}{' '}
            <AssetRenderer asset={customData?.collateral} />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">-</td>
        <td className="tw-hidden md:tw-table-cell">-</td>
        <td className="tw-hidden xl:tw-table-cell">-</td>
        <td className="tw-hidden sm:tw-table-cell">-</td>
        <td className="tw-hidden 2xl:tw-table-cell">-</td>
        <td className="tw-hidden 2xl:tw-table-cell">-</td>
        <td className="tw-hidden 2xl:tw-table-cell">
          <LinkToExplorer
            className="tw-m-0 tw-whitespace-nowrap"
            txHash={item.transactionHash}
            startLength={5}
            endLength={5}
          />
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
            <div className="tw-px-4 xl:tw-px-2">
              {item.status === TxStatus.FAILED && (
                <p className="tw-m-0">{t(translations.common.failed)}</p>
              )}
              {item.status === TxStatus.PENDING && (
                <p className="tw-m-0">{t(translations.common.pending)}</p>
              )}
              <LinkToExplorer
                className="tw-text-primary tw-font-normal tw-whitespace-nowrap tw-m-0"
                startLength={5}
                endLength={5}
                txHash={item.transactionHash}
              />
            </div>
            <div>
              {item.status === TxStatus.FAILED && (
                <img
                  src={iconRejected}
                  title="Failed"
                  className="tw-min-w-6 tw-ml-1.5"
                  alt="Failed"
                />
              )}
              {item.status === TxStatus.PENDING && (
                <img
                  src={iconPending}
                  title="Pending"
                  className="tw-min-w-6 tw-ml-1.5 tw-animate-spin"
                  alt="Pending"
                />
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

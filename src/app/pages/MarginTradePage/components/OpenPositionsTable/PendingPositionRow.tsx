import React from 'react';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
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
        <td className="tw-w-full">
          <PositionBlock
            position={customData?.position}
            name={customData?.pair.name}
          />
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">
          <div className="tw-truncate">
            {weiToNumberFormat(customData?.amount, 4)}{' '}
            <AssetRenderer asset={customData?.collateral} />
          </div>
        </td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">-</td>
        <td className="tw-w-full tw-hidden md:tw-table-cell">-</td>
        <td className="tw-w-full tw-hidden xl:tw-table-cell">-</td>
        <td className="tw-w-full tw-hidden sm:tw-table-cell">-</td>
        <td className="tw-w-full tw-hidden 2xl:tw-table-cell">-</td>
        <td className="tw-w-full tw-hidden 2xl:tw-table-cell">-</td>
        <td className="tw-w-full">
          <div className="tw-flex tw-items-center tw-justify-between lg:tw-w-5/6 tw-p-0">
            <div>
              {item.status === TxStatus.FAILED && (
                <p className="tw-m-0">{t(translations.common.failed)}</p>
              )}
              {item.status === TxStatus.PENDING && (
                <p className="tw-m-0">{t(translations.common.pending)}</p>
              )}
              <LinkToExplorer
                startLength={6}
                txHash={item.transactionHash}
                className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
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

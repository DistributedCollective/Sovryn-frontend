import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import React, { useCallback } from 'react';
import { TableRow } from '../TableRow/index';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { LendingEvent } from '../../../types';
import { LendingHistoryType } from 'utils/graphql/rsk/generated';

interface ITableBodyProps {
  items: LendingEvent[];
  loading: boolean;
}

export const TableBody: React.FC<ITableBodyProps> = ({ items, loading }) => {
  const { t } = useTranslation();

  const getEventType = useCallback(
    type => {
      switch (type) {
        case LendingHistoryType.Lend:
          return t(translations.lendingPage.deposit);
        case LendingHistoryType.UnLend:
          return t(translations.lendingPage.withdraw);
        default:
          return '';
      }
    },
    [t],
  );

  return (
    <tbody className="tw-mt-12">
      {items.map((item, index) => (
        <TableRow
          key={`${item.emittedBy}/${index}`}
          time={item.timestamp}
          txHash={item.txHash}
          amount={item.amount}
          type={getEventType(item.type)}
          asset={
            AssetsDictionary.getByLoanContractAddress(item.emittedBy)?.asset
          }
        />
      ))}

      {loading && (
        <tr key="loading">
          <td colSpan={99}>
            <SkeletonRow loadingText={t(translations.topUpHistory.loading)} />
          </td>
        </tr>
      )}
      {items.length === 0 && !loading && (
        <tr key="empty">
          <td className="tw-text-center" colSpan={99}>
            {t(translations.liquidityMining.historyTable.emptyState)}
          </td>
        </tr>
      )}
    </tbody>
  );
};

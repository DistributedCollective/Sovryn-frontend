import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import React, { useCallback } from 'react';
import { TableRow } from '../TableRow/index';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { weiTo4 } from 'utils/blockchain/math-helpers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { LendingEvent } from '../../../types';
import { LendingEventType } from 'app/pages/LendingPage/types';

interface ITableBodyProps {
  items: LendingEvent[];
  loading: boolean;
}

export const TableBody: React.FC<ITableBodyProps> = ({ items, loading }) => {
  const { t } = useTranslation();

  const getEvenetType = useCallback(
    type => {
      switch (type) {
        case LendingEventType.MINT:
          return t(translations.lendingPage.deposit);
        case LendingEventType.BURN:
          return t(translations.lendingPage.withdraw);
        default:
          return '';
      }
    },
    [t],
  );

  return (
    <tbody className="mt-5">
      {items.map((item, index) => (
        <TableRow
          key={`${item.contract_address}/${index}`}
          time={item.time}
          txHash={item.txHash}
          amount={weiTo4(item.asset_amount)}
          type={getEvenetType(item.event)}
          asset={
            AssetsDictionary.getByLoanContractAddress(item.contract_address)
              ?.asset
          }
        />
      ))}

      {loading && (
        <tr key={'loading'}>
          <td colSpan={99}>
            <SkeletonRow loadingText={t(translations.topUpHistory.loading)} />
          </td>
        </tr>
      )}
      {items.length === 0 && !loading && (
        <tr key={'empty'}>
          <td className="text-center" colSpan={99}>
            {t(translations.liquidityMining.historyTable.emptyState)}
          </td>
        </tr>
      )}
    </tbody>
  );
};

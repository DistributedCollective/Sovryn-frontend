import { useEffect } from 'hoist-non-react-statics/node_modules/@types/react';
import React, { useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Pagination } from '../../../../components/Pagination';
import { SkeletonRow } from '../../../../components/Skeleton/SkeletonRow';
import { usePerpetual_FundingHistory } from '../../hooks/usePerpetual_FundingHistory';
import { AccountFundingHistoryRow } from './AccountFundingHistoryRow';

type AccountFundingHistoryProps = {
  pairType: PerpetualPairType;
};

const perPage = 8;

export const AccountFundingHistory: React.FC<AccountFundingHistoryProps> = ({
  pairType,
}) => {
  const { t } = useTranslation();
  const { data: entries, loading } = usePerpetual_FundingHistory();

  const [page, setPage] = useState(0);
  const onPageChange = useCallback(page => setPage(page?.currentPage), []);

  const rows = useMemo(() => {
    if (entries && entries.length > 0) {
      return entries
        .slice((page - 1) * perPage, page * perPage)
        .map(entry => <AccountFundingHistoryRow key={entry.id} {...entry} />);
    } else if (loading) {
      return (
        <tr>
          <td colSpan={99}>
            <SkeletonRow />
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td colSpan={99}>{t(translations.openPositionTable.noData)}</td>
      </tr>
    );
  }, [entries, page, loading, t]);

  return (
    <div className="tw-w-full tw-px-2 sm:tw-px-12 tw-mx-auto">
      <table className="sovryn-table tw-table-auto">
        <thead>
          <tr>
            <th className="tw-text-xs">
              {t(translations.perpetualPage.accountBalance.action)}
            </th>
            <th className="tw-text-xs tw-text-right">
              {t(translations.perpetualPage.accountBalance.time)}
            </th>
            <th className="tw-text-xs tw-text-right">
              {t(translations.perpetualPage.accountBalance.amount)}
            </th>
            <th className="tw-text-xs">
              {t(translations.perpetualPage.accountBalance.transactionId)}
            </th>
            <th className="tw-text-xs">
              {t(translations.perpetualPage.accountBalance.status)}
            </th>
          </tr>
        </thead>
        <tbody className="tw-text-xs">{rows}</tbody>
      </table>

      {entries && entries.length > 0 && (
        <Pagination
          totalRecords={entries.length}
          pageLimit={perPage}
          pageNeighbours={2}
          onChange={onPageChange}
        />
      )}
    </div>
  );
};

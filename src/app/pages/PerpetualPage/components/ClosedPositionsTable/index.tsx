import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { usePerpetual_ClosedPositions } from '../../hooks/usePerpetual_ClosedPositions';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { ClosedPositionRow } from './ClosedPositionRow';
import { Pagination } from 'app/components/Pagination';

interface IClosedPositionsTableProps {
  perPage: number;
}

export const ClosedPositionsTable: React.FC<IClosedPositionsTableProps> = ({
  perPage,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { pairType } = useSelector(selectPerpetualPage);
  const { data, loading, totalCount } = usePerpetual_ClosedPositions(
    pairType,
    page,
    perPage,
  );

  const onPageChanged = useCallback(data => {
    setPage(data.currentPage);
  }, []);

  const isEmpty = useMemo(() => !loading && !data?.length, [data, loading]);
  const showLoading = useMemo(() => loading && !data?.length, [data, loading]);

  return (
    <>
      <table className="sovryn-table tw-table-auto">
        <thead>
          <tr>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.closedPositionsTable.dateTime)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.closedPositionsTable.symbol)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.closedPositionsTable.collateral)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.closedPositionsTable.positionSize)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.closedPositionsTable.realizedPnl)}
            </th>
          </tr>
        </thead>

        <tbody className="tw-text-xs">
          {isEmpty && (
            <tr>
              <td colSpan={99}>
                {t(translations.perpetualPage.closedPositionsTable.noData)}
              </td>
            </tr>
          )}

          {showLoading && (
            <tr>
              <td colSpan={99}>
                <SkeletonRow />
              </td>
            </tr>
          )}

          {data?.map(item => (
            <ClosedPositionRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>

      {data && totalCount > 0 && (
        <Pagination
          totalRecords={totalCount}
          pageLimit={perPage}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
};

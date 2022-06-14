import { Pagination } from 'app/components/Pagination';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { translations } from 'locales/i18n';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePerpetual_OrderHistory } from '../../hooks/usePerpetual_OrderHistory';
import { OrderHistoryRow } from './OrderHistoryRow';
import { Tooltip } from '@blueprintjs/core';

interface IOrderHistoryTableProps {
  perPage: number;
}

export const OrderHistoryTable: React.FC<IOrderHistoryTableProps> = ({
  perPage,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, loading, totalCount } = usePerpetual_OrderHistory(
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
              {t(translations.perpetualPage.orderHistoryTable.dateTime)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.orderHistoryTable.symbol)}
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.orderHistoryTable.tooltips.type,
                )}
              >
                {t(translations.perpetualPage.orderHistoryTable.orderType)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.orderHistoryTable.tooltips.state,
                )}
              >
                {t(translations.perpetualPage.orderHistoryTable.orderState)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.orderHistoryTable.collateral)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.orderHistoryTable.orderSize)}
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.orderHistoryTable.tooltips
                    .triggerPrice,
                )}
              >
                {t(translations.perpetualPage.orderHistoryTable.triggerPrice)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.orderHistoryTable.tooltips
                    .limitPrice,
                )}
              >
                {t(translations.perpetualPage.orderHistoryTable.limitPrice)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.orderHistoryTable.execPrice)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.orderHistoryTable.orderId)}
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
            <OrderHistoryRow key={item.id} item={item} />
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

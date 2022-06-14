import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePerpetual_FundingPayments } from '../../hooks/usePerpetual_FundingPayments';
import { translations } from 'locales/i18n';
import React from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { Pagination } from 'app/components/Pagination';
import { FundingPaymentsRow } from './FundingPaymentsRow';
import { Tooltip } from '@blueprintjs/core';

interface IFundingPaymentsTable {
  perPage: number;
}

export const FundingPaymentsTable: React.FC<IFundingPaymentsTable> = ({
  perPage,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, loading, totalCount } = usePerpetual_FundingPayments(
    page,
    perPage,
  );

  const onPageChanged = useCallback(data => setPage(data.currentPage), []);

  const isEmpty = useMemo(() => !loading && !data?.length, [data, loading]);
  const showLoading = useMemo(() => loading && !data?.length, [data, loading]);

  return (
    <>
      <table className="sovryn-table tw-table-auto">
        <thead>
          <tr>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.fundingPaymentsTable.dateTime)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.fundingPaymentsTable.symbol)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.fundingPaymentsTable.collateral)}
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.fundingPaymentsTable.tooltips
                    .receivedFunding,
                )}
              >
                {t(translations.perpetualPage.fundingPaymentsTable.received)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.fundingPaymentsTable.tooltips.rate,
                )}
              >
                {t(translations.perpetualPage.fundingPaymentsTable.rate)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.fundingPaymentsTable.tooltips
                    .timeSinceLastPayment,
                )}
              >
                {t(
                  translations.perpetualPage.fundingPaymentsTable
                    .timeSinceLastPayment,
                )}
              </Tooltip>
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
            <FundingPaymentsRow key={item.id} item={item} />
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

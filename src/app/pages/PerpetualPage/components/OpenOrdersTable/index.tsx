import React from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { OpenOrderRow } from './components/OpenOrderRow';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { usePerpetual_OpenOrders } from '../../hooks/usePerpetual_OpenOrders';
import { Tooltip } from '@blueprintjs/core';

type OpenOrdersTableProps = {
  perPage: number;
};

export const OpenOrdersTable: React.FC<OpenOrdersTableProps> = ({
  perPage,
}) => {
  const { t } = useTranslation();

  const { data: items, loading } = usePerpetual_OpenOrders(useAccount());

  const isEmpty = !loading && !items?.length;
  const showLoading = loading && !items?.length;

  return (
    <table className="sovryn-table tw-table-auto">
      <thead>
        <tr>
          <th className="tw-text-sm">
            {t(translations.perpetualPage.openOrdersTable.dateTime)}
          </th>
          <th className="tw-text-sm">
            {t(translations.perpetualPage.openOrdersTable.symbol)}
          </th>
          <th className="tw-text-sm">
            <Tooltip
              position="bottom"
              popoverClassName="tw-max-w-md tw-font-light"
              content={t(
                translations.perpetualPage.openOrdersTable.tooltips.orderType,
              )}
            >
              {t(translations.perpetualPage.openOrdersTable.orderType)}
            </Tooltip>
          </th>
          <th className="tw-text-sm">
            <Tooltip
              position="bottom"
              popoverClassName="tw-max-w-md tw-font-light"
              content={t(
                translations.perpetualPage.openOrdersTable.tooltips.collateral,
              )}
            >
              {t(translations.perpetualPage.openOrdersTable.collateral)}
            </Tooltip>
          </th>
          <th className="tw-text-sm">
            <Tooltip
              position="bottom"
              popoverClassName="tw-max-w-md tw-font-light"
              content={t(
                translations.perpetualPage.openOrdersTable.tooltips.orderSize,
              )}
            >
              {t(translations.perpetualPage.openOrdersTable.orderSize)}
            </Tooltip>
          </th>
          <th className="tw-text-sm">
            <Tooltip
              position="bottom"
              popoverClassName="tw-max-w-md tw-font-light"
              content={t(
                translations.perpetualPage.openOrdersTable.tooltips.limitPrice,
              )}
            >
              {t(translations.perpetualPage.openOrdersTable.limitPrice)}
            </Tooltip>
          </th>
          <th className="tw-text-sm">
            <Tooltip
              position="bottom"
              popoverClassName="tw-max-w-md tw-font-light"
              content={t(
                translations.perpetualPage.openOrdersTable.tooltips
                  .triggerPrice,
              )}
            >
              {t(translations.perpetualPage.openOrdersTable.triggerPrice)}
            </Tooltip>
          </th>
          <th className="tw-text-sm">
            {t(translations.perpetualPage.openOrdersTable.timeInForce)}
          </th>
          <th className="tw-text-sm">
            {t(translations.perpetualPage.openOrdersTable.transactionId)}
          </th>
        </tr>
      </thead>
      <tbody className="tw-text-xs">
        {isEmpty && (
          <tr>
            <td colSpan={99}>{t(translations.openPositionTable.noData)}</td>
          </tr>
        )}
        {showLoading && (
          <tr>
            <td colSpan={99}>
              <SkeletonRow />
            </td>
          </tr>
        )}
        {items?.map(item => (
          <OpenOrderRow key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  );
};

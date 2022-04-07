import React, { useMemo } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { OpenPositionRow } from './components/OpenPositionRow';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useSelector } from 'react-redux';
import { usePerpetual_OpenPositions } from '../../hooks/usePerpetual_OpenPositions';
import { selectPerpetualPage } from '../../selectors';
import { Tooltip } from '@blueprintjs/core';

interface IOpenPositionsTableProps {
  perPage: number;
}

export function OpenPositionsTable({ perPage }: IOpenPositionsTableProps) {
  const { t } = useTranslation();
  const { pairType } = useSelector(selectPerpetualPage);

  const { data, loading } = usePerpetual_OpenPositions(useAccount(), pairType);

  const items = useMemo(() => data || [], [data]);

  const isEmpty = !loading && !items.length;
  const showLoading = loading && !items.length;

  return (
    <>
      <table className="sovryn-table tw-table-auto">
        <thead>
          <tr>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.openPositionsTable.pair)}
            </th>
            <th className="tw-text-right tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .positionSize,
                )}
              >
                {t(translations.perpetualPage.openPositionsTable.positionSize)}
              </Tooltip>
            </th>
            <th className="tw-hidden md:tw-table-cell tw-text-right tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .entryPrice,
                )}
              >
                {t(translations.perpetualPage.openPositionsTable.entryPrice)}
              </Tooltip>
            </th>
            <th className="tw-hidden xl:tw-table-cell tw-text-right tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .liquidationPrice,
                )}
              >
                {t(
                  translations.perpetualPage.openPositionsTable
                    .liquidationPrice,
                )}
              </Tooltip>
            </th>
            <th className="tw-text-right tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.openPositionsTable.tooltips.margin,
                )}
              >
                {t(translations.perpetualPage.openPositionsTable.margin)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .unrealized,
                )}
              >
                {t(translations.perpetualPage.openPositionsTable.unrealized)}
              </Tooltip>
            </th>
            <th className="tw-text-sm tw-hidden 2xl:tw-table-cell ">
              <Tooltip
                position="bottom"
                popoverClassName="tw-max-w-md tw-font-light"
                content={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .realized,
                )}
              >
                {t(translations.perpetualPage.openPositionsTable.realized)}
              </Tooltip>
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.openPositionsTable.actions)}
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
          {items.map(item => (
            <OpenPositionRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </>
  );
}

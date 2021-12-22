import React, { useMemo } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { OpenPositionRow } from './OpenPositionRow';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useSelector } from 'react-redux';
import { usePerpetual_OpenPosition } from '../../hooks/usePerpetual_OpenPositions';
import { selectPerpetualPage } from '../../selectors';

interface IOpenPositionsTableProps {
  perPage: number;
}

export function OpenPositionsTable({ perPage }: IOpenPositionsTableProps) {
  const { t } = useTranslation();
  const { pairType } = useSelector(selectPerpetualPage);

  const { data, loading } = usePerpetual_OpenPosition(useAccount(), pairType);

  const items = useMemo(() => (data && data.margin > 0 ? [data] : []), [data]);

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
              {t(translations.perpetualPage.openPositionsTable.positionSize)}
            </th>
            <th className="tw-hidden md:tw-table-cell tw-text-right tw-text-sm">
              {t(translations.perpetualPage.openPositionsTable.entryPrice)}
            </th>
            <th className="tw-hidden xl:tw-table-cell tw-text-right tw-text-sm">
              {t(translations.perpetualPage.openPositionsTable.markPrice)}
            </th>
            <th className="tw-hidden xl:tw-table-cell tw-text-right tw-text-sm">
              {t(
                translations.perpetualPage.openPositionsTable.liquidationPrice,
              )}
            </th>
            <th className="tw-text-right tw-text-sm">
              {t(translations.perpetualPage.openPositionsTable.margin)}
            </th>
            <th className="tw-text-sm">
              {t(translations.perpetualPage.openPositionsTable.unrealized)}
            </th>
            <th className="tw-text-sm tw-hidden 2xl:tw-table-cell ">
              {t(translations.perpetualPage.openPositionsTable.realized)}
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

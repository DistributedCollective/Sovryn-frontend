import React from 'react';
import { useTranslation } from 'react-i18next';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { translations } from 'locales/i18n';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';

export interface Props {
  account: string;
}

export function RewardHistory({ account }: Props) {
  const { t } = useTranslation();

  const { events, loading } = useGetContractPastEvents(
    'lockedSov',
    'TokensStaked',
    { _initiator: account },
  );

  const rows = events?.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="tw-align-middle">-</td>
      <td className="tw-align-middle">- SOV</td>
      <td className="tw-align-middle">-</td>
      <td className="tw-align-middle md:tw-table-cell tw-hidden">-</td>
      <td className="tw-align-middle md:tw-table-cell tw-hidden">-</td>
    </tr>
  ));

  return (
    <div>
      <table className="table sovryn-table tw-align-middle">
        <thead className="">
          <tr className="">
            <th>{t(translations.rewardPage.historyTable.tableHeaders.time)}</th>
            <th>{t(translations.rewardPage.historyTable.tableHeaders.type)}</th>
            <th>
              {t(translations.rewardPage.historyTable.tableHeaders.amount)}
            </th>
            <th>
              {t(
                translations.rewardPage.historyTable.tableHeaders
                  .transactionHash,
              )}
            </th>
            <th>
              {t(translations.rewardPage.historyTable.tableHeaders.status)}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr key={'loading'}>
              <td colSpan={99}>
                <SkeletonRow
                  loadingText={t(translations.rewardPage.historyTable.loading)}
                />
              </td>
            </tr>
          )}
          {events.length === 0 && !loading && (
            <tr key={'empty'}>
              <td className="tw-text-center" colSpan={99}>
                <div className="tw-pt-6">
                  {t(translations.rewardPage.historyTable.emptyState)}
                </div>
              </td>
            </tr>
          )}
          {rows}
        </tbody>
      </table>
    </div>
  );
}

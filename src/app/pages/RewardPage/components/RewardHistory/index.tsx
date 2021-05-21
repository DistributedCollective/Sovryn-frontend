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
      <td className="align-middle">-</td>
      <td className="align-middle">- SOV</td>
      <td className="align-middle">-</td>
      <td className="align-middle d-md-table-cell d-none">-</td>
      <td className="align-middle d-md-table-cell d-none">-</td>
    </tr>
  ));

  return (
    <div>
      <table className="table sovryn-table align-middle">
        <thead className="">
          <tr className="">
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Transaction Hash</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr key={'loading'}>
              <td colSpan={99}>
                <SkeletonRow
                  loadingText={t(translations.topUpHistory.loading)}
                />
              </td>
            </tr>
          )}
          {events.length === 0 && !loading && (
            <tr key={'empty'}>
              <td className="text-center" colSpan={99}>
                <div className="tw-pt-6">History is empty.</div>
              </td>
            </tr>
          )}
          {rows}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetContractPastEvents } from '../../hooks/useGetContractPastEvents';
import { translations } from '../../../locales/i18n';

export function ReferralHistory() {
  const { t } = useTranslation();
  const { events, loading } = useGetContractPastEvents(
    'affiliates',
    'PayTradingFeeToAffiliate',
  );

  useEffect(() => {
    console.log('PayTradingFeeToAffiliate', events, loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  return (
    <section>
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th className="d-none d-lg-table-cell">
                {t(translations.referral.tableHeaders.date)}
              </th>
              <th className="d-none d-lg-table-cell">
                {t(translations.referral.tableHeaders.type)}
              </th>
              <th className="d-none d-lg-table-cell">
                {t(translations.referral.tableHeaders.from)}
              </th>
              <th>{t(translations.referral.tableHeaders.amount)}</th>
              <th>{t(translations.referral.tableHeaders.hash)}</th>
              <th>{t(translations.referral.tableHeaders.status)}</th>
            </tr>
          </thead>
          <tbody className="mt-5">
            <tr key={'empty'}>
              <td className="text-center" colSpan={99}>
                History is empty.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

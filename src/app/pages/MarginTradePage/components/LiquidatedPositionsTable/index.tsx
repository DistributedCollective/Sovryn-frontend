import React from 'react';
import { useTranslation } from 'react-i18next';
import type { OpenLoanType } from 'types/active-loan';
import { translations } from 'locales/i18n';
import { LiquidatedPositionRow } from './LiquidatedPositionRow';
interface ILiquidatedPositionsTableProps {
  liquidateLoans: OpenLoanType[];
}

export const LiquidatedPositionsTable: React.FC<ILiquidatedPositionsTableProps> = ({
  liquidateLoans,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <tr>
        <td
          colSpan={9}
          className="tw-p-2 tw-border tw-border-gray tw-rounded-2xl"
        >
          <table className="tw-table">
            <thead>
              <tr className="tw-bg-transparent">
                <th>{t(translations.openPositionTable.event)}</th>
                <th>{t(translations.openPositionTable.amountRepaid)}</th>
                <th>{t(translations.openPositionTable.collateralWithdrawn)}</th>
                <th>{t(translations.openPositionTable.exitPrice)}</th>
                <th>{t(translations.openPositionTable.timestamp)}</th>
                <th>{t(translations.openPositionTable.txID)}</th>
              </tr>
            </thead>
            <tbody>
              {liquidateLoans.map(item => (
                <LiquidatedPositionRow liquidatedLoan={item} />
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
};

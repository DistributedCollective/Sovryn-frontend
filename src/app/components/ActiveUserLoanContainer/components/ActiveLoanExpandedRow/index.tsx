/**
 *
 * ActiveLoanExpandedRow
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberToPercent, numberToUSD } from 'utils/display-text/format';

export function ActiveLoanExpandedRow(props) {
  const { t } = useTranslation();

  return (
    <>
      <tr className="table-header border-0" onClick={props.handleClick}>
        <td></td>
        <td>{t(translations.activeLoan.expandedRow.leverage)}</td>
        <td>{t(translations.activeLoan.expandedRow.startMargin)}</td>
        <td>{t(translations.activeLoan.expandedRow.mainenanceMargin)}</td>
        <td>{t(translations.activeLoan.expandedRow.currentPrice)}</td>
        <td>{t(translations.activeLoan.expandedRow.liquidationPrice)}</td>
        <td>{t(translations.activeLoan.expandedRow.renewalDate)}</td>
      </tr>

      <tr
        style={{
          opacity: '1',
          borderTop: 'none',
          borderBottom: '1px solid var(--white)',
        }}
        onClick={props.handleClick}
      >
        <td></td>
        <td>{props.data.leverage}X</td>
        <td>{numberToPercent(props.data.startMargin, 2)}</td>
        <td>{props.data.maintenanceMargin}</td>
        <td>{props.data.currentPrice}</td>
        <td>{numberToUSD(props.data.liquidationPrice, 2)}</td>
        <td>{props.data.endDate}</td>
      </tr>
    </>
  );
}

/**
 *
 * ActiveLoanExpandedRow
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function ActiveLoanExpandedRow(props) {
  const { t } = useTranslation();

  return (
    <>
      <tr style={{ opacity: '1' }} onClick={props.handleClick}>
        <td>{props.data.icon}</td>
        <td>{props.data.positionSize}</td>
        <td>{props.data.currentMargin}</td>
        <td>{props.data.interestAPR}</td>
        <td>{props.data.startPrice}</td>
        <td>{props.data.profit}</td>
        <td>{props.data.actions}</td>
      </tr>

      <tr
        className="table-header"
        style={{ opacity: '1', border: 'none' }}
        onClick={props.handleClick}
      >
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
        <td>{props.data.leverage}</td>
        <td>{props.data.startMargin}</td>
        <td>{props.data.maintenanceMargin}</td>
        <td>{props.data.currentPrice}</td>
        <td>{props.data.liquidationPrice}</td>
        <td>{props.data.endDate}</td>
      </tr>
    </>
  );
}

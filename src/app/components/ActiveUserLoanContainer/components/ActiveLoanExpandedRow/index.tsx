/**
 *
 * ActiveLoanExpandedRow
 *
 */

import React from 'react';

export function ActiveLoanExpandedRow(props) {
  return (
    <>
      <tr
        className="table-header"
        style={{ opacity: '1', border: 'none' }}
        onClick={props.handleClick}
      >
        <td></td>
        <td>Leverage</td>
        <td>Start Margin</td>
        <td>Mainenance Margin</td>
        <td>Current Price</td>
        <td>Liquidation Price</td>
        <td>Renewal Date</td>
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
        <td>
          {props.data.startMargin.toLocaleString('en', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}{' '}
          %
        </td>
        <td>{props.data.maintenanceMargin}</td>
        <td>
          ${' '}
          {props.data.currentPrice.toLocaleString('en', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </td>
        <td>{props.data.liquidationPrice}</td>
        <td>{props.data.endDate}</td>
      </tr>
    </>
  );
}

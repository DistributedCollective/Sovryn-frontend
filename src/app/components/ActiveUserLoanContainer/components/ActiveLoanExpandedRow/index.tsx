/**
 *
 * ActiveLoanExpandedRow
 *
 */

import React from 'react';
import { numberToPercent, numberToUSD } from 'utils/display-text/format';

export function ActiveLoanExpandedRow(props) {
  return (
    <>
      <tr className="table-header border-0" onClick={props.handleClick}>
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
        <td>{numberToPercent(props.data.startMargin, 2)}</td>
        <td>{props.data.maintenanceMargin}</td>
        <td>{numberToUSD(props.data.currentPrice, 2)}</td>
        <td>{props.data.liquidationPrice}</td>
        <td>{props.data.endDate}</td>
      </tr>
    </>
  );
}

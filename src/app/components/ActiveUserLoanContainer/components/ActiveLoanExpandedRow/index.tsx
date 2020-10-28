/**
 *
 * ActiveLoanExpandedRow
 *
 */
import React from 'react';

export function ActiveLoanExpandedRow(props) {
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

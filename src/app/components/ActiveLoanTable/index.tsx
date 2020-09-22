/**
 *
 * ActiveLoanTable
 *
 */
import React, { useState, useEffect } from 'react';
import { weiTo2 } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faSort,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  data: any;
}

export function ActiveLoanTable(props: Props) {
  const [sortColumn, setSortColumn] = useState({});

  const date = (timestamp: string) =>
    new Date(Number(timestamp) * 1e3).toLocaleString('en-GB', {
      timeZone: 'GMT',
    });

  const cells = props.data.map((item, index) => (
    <tr key={index}>
      <td>
        <FontAwesomeIcon className="text-customTeal" icon={faArrowCircleUp} />
      </td>
      <td>
        {parseFloat(weiTo2(item.collateral)).toLocaleString('en')}{' '}
        {symbolByTokenAddress(item.collateralToken)}
      </td>
      <td>{weiTo2(item.currentMargin)}%</td>
      <td>todo</td>
      <td>todo</td>
      <td>{date(item.endTimestamp).slice(0, -3)} GMT</td>
    </tr>
  ));

  function handleSort(col) {
    let sortedData = [...props.data];
    if (col === 'positionSize') {
      sortedData.sort((a, b) =>
        parseInt(a.collateral) > parseInt(b.collateral) ? 1 : -1,
      );
    } else if (col === 'currentMargin') {
      alert('current margin');
    }
    console.log(sortedData);
  }

  return (
    <>
      <table className="bp3-html-table">
        <thead>
          <tr>
            <th></th>
            <th>
              Position Size
              <FontAwesomeIcon
                className="text-lightGrey ml-1"
                icon={faSort}
                onClick={() => handleSort('positionSize')}
              />
            </th>
            <th>
              Current Margin
              <FontAwesomeIcon
                className="text-lightGrey ml-1"
                icon={faSort}
                onClick={() => handleSort('currentMargin')}
              />
            </th>
            <th>Interest APR</th>
            <th>Start Price</th>
            <th>
              End Date
              <FontAwesomeIcon
                className="text-lightGrey ml-1"
                icon={faSort}
                onClick={() => handleSort('endDate')}
              />
            </th>
          </tr>
        </thead>
        <tbody>{cells}</tbody>
      </table>
    </>
  );
}

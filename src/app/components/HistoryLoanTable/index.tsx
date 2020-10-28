import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { weiTo2, weiTo4 } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { useTradingHistoryRow } from '../../hooks/trading/useTradingHistoryRow';

interface Props {
  items: any;
}

export function HistoryLoanTable(props: Props) {
  const data = React.useMemo(() => {
    return props.items.map(item => {
      return {
        item: item,
        icon:
          symbolByTokenAddress(item.returnValues.collateralToken) === 'BTC' ? (
            <FontAwesomeIcon
              icon={faArrowAltCircleUp}
              className="text-customTeal ml-2"
              style={{ fontSize: '20px' }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faArrowAltCircleDown}
              className="text-Gold ml-2"
              style={{ fontSize: '20px' }}
            />
          ),
        positionSize: parseFloat(
          weiTo4(item.returnValues.positionCloseSize),
        ).toLocaleString('en'),
        status: item.event === 'CloseWithSwap' ? 'Closed' : 'Open',
        profit: 'Profit',
      };
    });
  }, [props.items]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Icon',
        accessor: 'icon',
        sortable: false,
      },
      {
        Header: 'Position Size At Close',
        accessor: 'positionSize',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: 'Profit',
        accessor: 'profit',
        sortable: true,
      },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);
  return (
    <table {...getTableProps()} className="bp3-html-table table-dark">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {column.sortable && (
                  <span className="float-right">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FontAwesomeIcon
                          icon={faSortDown}
                          className="mr-1 text-white"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSortUp}
                          className="mr-1 text-white"
                        />
                      )
                    ) : (
                      <FontAwesomeIcon
                        icon={faSort}
                        className="mr-1 text-lightGrey"
                      />
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

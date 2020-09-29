/**
 *
 * ActiveLoanTable
 *
 */
import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { CloseTradingPositionHandler } from '../../containers/CloseTradingPositionHandler';
import { TopUpTradingPositionHandler } from '../../containers/TopUpTradingPositionHandler';
import { DisplayDate } from '../DisplayDate';
import { CurrentMargin } from '../CurrentMargin';
import { InterestAPR } from '../InterestAPR';
import { weiTo2, weiToFixed } from '../../../utils/blockchain/math-helpers';
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

interface Props {
  data: any;
  activeTrades: boolean;
}

export function ActiveLoanTable(props: Props) {
  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);
  const [positionMarginModalOpen, setPositionMarginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(props.data[0]);

  const data = React.useMemo(() => {
    return props.data.map(item => {
      return {
        item: item,
        icon:
          symbolByTokenAddress(item.collateralToken) === 'BTC' ? (
            <FontAwesomeIcon
              icon={faArrowAltCircleUp}
              className="text-customTeal ml-2"
              style={{ fontSize: '20px' }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faArrowAltCircleDown}
              className="text-customOrange ml-2"
              style={{ fontSize: '20px' }}
            />
          ),
        positionSize: `${parseFloat(weiToFixed(item.collateral, 4))} 
        ${symbolByTokenAddress(item.collateralToken)}`,
        currentMargin: (
          <CurrentMargin
            currentMargin={item.currentMargin}
            startMargin={item.startMargin}
          />
        ),
        interestAPR: (
          <InterestAPR
            interestPerDay={item.interestOwedPerDay}
            principal={item.principal}
          />
        ),
        startPrice: `$ ${parseFloat(weiTo2(item.startRate)).toLocaleString(
          'en',
        )}`,
        endDate: <DisplayDate timestamp={item.endTimestamp} />,
        borrowed: '',
        startMargin: '',
        maintenanceMargin: '',
        currentPrice: '',
        liquidationPrice: '',
        topUp: (
          <TopUpButton
            onClick={() => {
              setPositionMarginModalOpen(true);
              setSelectedItem(item);
            }}
          >
            Top-Up
          </TopUpButton>
        ),
        close: (
          <CloseButton
            onClick={() => {
              setPositionCloseModalOpen(true);
              setSelectedItem(item);
            }}
          >
            Close
          </CloseButton>
        ),
      };
    });
  }, [props.data]);

  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'icon',
        sortable: false,
      },
      {
        Header: 'Position Size',
        accessor: 'positionSize',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: 'Current Margin',
        accessor: 'currentMargin',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: 'Interest APR',
        accessor: 'interestAPR',
      },
      {
        Header: 'Start Price',
        accessor: 'startPrice',
      },
      {
        Header: 'Renewal Date',
        accessor: 'endDate',
        sortable: true,
      },
      {
        Header: '',
        accessor: 'topUp',
      },
      {
        Header: '',
        accessor: 'close',
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
    <>
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
                  return (
                    <td className="align-middle" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <CloseTradingPositionHandler
        item={selectedItem}
        showModal={positionCloseModalOpen}
        onCloseModal={() => setPositionCloseModalOpen(false)}
      />
      <TopUpTradingPositionHandler
        item={selectedItem}
        showModal={positionMarginModalOpen}
        onCloseModal={() => setPositionMarginModalOpen(false)}
      />
    </>
  );
}

const TopUpButton = styled.button`
  border: 1px solid var(--Green);
  width: 77px;
  height: 32px;
  color: var(--Green);
  background-color: var(--bg-secondary);
`;

const CloseButton = styled.button`
  border: 1px solid var(--Red);
  width: 77px;
  height: 32px;
  color: var(--Red);
  background-color: var(--bg-secondary);
`;

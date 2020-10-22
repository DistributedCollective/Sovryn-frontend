/**
 *
 * ActiveLoanTable
 *
 */
import React, { useEffect, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { CloseTradingPositionHandler } from '../../containers/CloseTradingPositionHandler';
import { TopUpTradingPositionHandler } from '../../containers/TopUpTradingPositionHandler';
import { CurrentMargin } from '../CurrentMargin';
import { InterestAPR } from '../InterestAPR';
import {
  weiTo2,
  weiTo18,
  weiToFixed,
} from '../../../utils/blockchain/math-helpers';
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
import { Text } from '@blueprintjs/core';

interface Props {
  data: any;
  activeTrades: boolean;
}

export function ActiveLoanTable(props: Props) {
  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);
  const [positionMarginModalOpen, setPositionMarginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(props.data[0]);

  const data = React.useMemo(() => {
    return props.data.map(item => {
      return {
        item: item,
        icon:
          symbolByTokenAddress(item.collateralToken) === 'BTC' ? (
            <FontAwesomeIcon
              icon={faArrowAltCircleUp}
              className="text-customTeal mx-2"
              style={{ fontSize: '20px' }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faArrowAltCircleDown}
              className="text-Gold ml-2"
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
        startPrice:
          symbolByTokenAddress(item.collateralToken) === 'BTC'
            ? `$ ${parseFloat(weiTo2(item.startRate)).toLocaleString('en')}`
            : `$ ${(1 / parseFloat(weiTo18(item.startRate))).toLocaleString(
                'en',
              )}`,
        profit: '',
        actions: (
          <div className="d-flex flex-row flex-nowrap justify-content-end">
            <div className="mr-1">
              <TopUpButton
                onClick={() => {
                  setPositionMarginModalOpen(true);
                  setSelectedItem(item);
                }}
              >
                Top-Up
              </TopUpButton>
            </div>
            <div className="ml-1">
              <CloseButton
                onClick={() => {
                  setPositionCloseModalOpen(true);
                  setSelectedItem(item);
                }}
              >
                Close
              </CloseButton>
            </div>
          </div>
        ),
      };
    });
  }, [props.data]);

  useEffect(() => {
    // Resets selected item in modals if items was changed.
    if (selectedItem && selectedItem.loanId) {
      const loan = props.data.find(item => item.loanId === selectedItem.loanId);
      setSelectedItem(loan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        Header: 'Profit / Loss',
        accessor: 'profit',
      },
      {
        Header: '',
        accessor: 'actions',
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
    <div className="bg-primary sovryn-border p-3">
      <table {...getTableProps()} className="sovryn-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Text ellipsize tagName="span">
                    {column.render('Header')}
                    {column.sortable && (
                      <span className="mx-1">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FontAwesomeIcon
                              icon={faSortDown}
                              className="text-white"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faSortUp}
                              className="text-white"
                            />
                          )
                        ) : (
                          <FontAwesomeIcon icon={faSort} />
                        )}
                      </span>
                    )}
                  </Text>
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

      {selectedItem && (
        <TopUpTradingPositionHandler
          item={selectedItem}
          showModal={positionMarginModalOpen}
          onCloseModal={() => setPositionMarginModalOpen(false)}
        />
      )}
    </div>
  );
}

const TopUpButton = styled.button.attrs(_ => ({ type: 'button' }))`
  border: 2px solid var(--green);
  width: 77px;
  height: 32px;
  color: var(--green);
  background-color: var(--primary);
  border-radius: 8px;
`;

const CloseButton = styled.button.attrs(_ => ({ type: 'button' }))`
  border: 2px solid var(--red);
  width: 77px;
  height: 32px;
  color: var(--red);
  background-color: var(--primary);
  border-radius: 8px;
`;

/**
 *
 * ActiveLoanTable
 *
 */
import React, { useEffect, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { CloseTradingPositionHandler } from '../../../../containers/CloseTradingPositionHandler';
import { TopUpTradingPositionHandler } from '../../../../containers/TopUpTradingPositionHandler';
import { CurrentMargin } from '../CurrentMargin';
import { InterestAPR } from '../InterestAPR';
import { ActiveLoanLiquidation } from '../ActiveLoanLiquidation';
import { ActiveLoanProfit } from '../ActiveLoanProfit';
import { DisplayDate } from '../DisplayDate';
import { ActiveLoanExpandedRow } from '../ActiveLoanExpandedRow';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import {
  weiTo18,
  weiToFixed,
} from '../../../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import styled from 'styled-components';
import { Icon } from '@blueprintjs/core';
import { Text } from '@blueprintjs/core';
import { Asset } from 'types/asset';

interface Props {
  data: any;
  activeTrades: boolean;
}

export function ActiveLoanTable(props: Props) {
  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);
  const [positionMarginModalOpen, setPositionMarginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(props.data[0]);
  const [expandedItem, setExpandedItem] = useState('');
  const [expandedId, setExpandedId] = useState('');
  //TODO: Assets should not be hardcoded
  const { value: currentPrice } = useBorrowAssetPrice(Asset.BTC, Asset.DOC);

  const data = React.useMemo(() => {
    return props.data.map(item => {
      return {
        item: item,
        icon:
          symbolByTokenAddress(item.collateralToken) === 'BTC' ? (
            <Icon
              icon="circle-arrow-up"
              className="text-customTeal mx-2"
              iconSize={20}
            />
          ) : (
            <Icon
              icon="circle-arrow-down"
              className="text-Gold ml-2"
              iconSize={20}
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
            ? `$ ${parseFloat(weiTo18(item.startRate)).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : `$ ${(1 / parseFloat(weiTo18(item.startRate))).toLocaleString(
                'en',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}`,
        endDate: <DisplayDate timestamp={item.endTimestamp} />,
        leverage: `${leverageFromMargin(item.startMargin)}x`,
        profit: <ActiveLoanProfit item={item} currentPrice={currentPrice} />,
        liquidationPrice: (
          <ActiveLoanLiquidation item={item} currentPrice={currentPrice} />
        ),
        currentPrice: parseFloat(weiTo18(currentPrice)).toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        maintenanceMargin: `${parseFloat(
          weiTo18(item.maintenanceMargin),
        ).toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} %`,
        startMargin: `${parseFloat(weiTo18(item.startMargin)).toLocaleString(
          'en',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )} %`,
        actions: (
          <div className="d-flex flex-row flex-nowrap justify-content-between">
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
  }, [props.data, currentPrice]);

  useEffect(() => {
    // Resets selected item in modals if items was changed.
    if (selectedItem && selectedItem.loanId) {
      const loan = props.data.find(item => item.loanId === selectedItem.loanId);
      setSelectedItem(loan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    if (!expandedId) {
      setExpandedItem('');
    }
  }, [expandedId]);

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
        sortable: true,
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
                            <Icon
                              icon="sort-desc"
                              className="text-white"
                              iconSize={15}
                            />
                          ) : (
                            <Icon
                              icon="sort-asc"
                              className="text-white"
                              iconSize={15}
                            />
                          )
                        ) : (
                          <Icon icon="double-caret-vertical" iconSize={15} />
                        )}
                      </span>
                    )}
                  </Text>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} style={{ cursor: 'pointer' }}>
          {rows.map(row => {
            prepareRow(row);
            return (
              //If row is expanded render expanded row
              row.id === expandedId ? (
                <ActiveLoanExpandedRow
                  data={expandedItem}
                  key={expandedId}
                  handleClick={() => setExpandedId('')}
                />
              ) : (
                <tr
                  {...row.getRowProps()}
                  onClick={() => {
                    setExpandedItem(data[row.id]);
                    setExpandedId(row.id);
                  }}
                  style={{
                    opacity: expandedId ? '0.2' : '1',
                    border: expandedId ? 'none' : '',
                  }}
                >
                  {row.cells.map(cell => {
                    return (
                      <td className="align-middle" {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              )
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

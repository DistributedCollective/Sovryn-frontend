import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { Icon, Text } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { actions } from 'app/containers/LendBorrowSovryn/slice';

import { InterestAPR } from '../ActiveUserLoanContainer/components/InterestAPR';
import { DisplayDate } from '../ActiveUserLoanContainer/components/DisplayDate';
import { BorrowAmount } from './BorrowAmount';
import { CollateralAmount } from './CollateralAmount';

interface Props {
  data: any;
}

export function ActiveBorrowTable(props: Props) {
  const dispatch = useDispatch();
  const columns = React.useMemo(
    () => [
      {
        Header: 'Borrowed',
        accessor: 'borrowAmount',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: 'Collateral',
        accessor: 'collateralAmount',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: 'Interest APR',
        accessor: 'interestAPR',
        sortable: true,
      },
      {
        Header: 'Payback until',
        accessor: 'endTimestamp',
        sortable: true,
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ],
    [],
  );
  const data = React.useMemo(() => {
    return props.data.map(item => {
      return {
        id: item.loanId,
        borrowAmount: (
          <BorrowAmount
            amount={item.principal}
            asset={
              AssetsDictionary.getByTokenContractAddress(item.loanToken).asset
            }
          />
        ),
        collateralAmount: (
          <CollateralAmount
            amount={item.collateral}
            asset={
              AssetsDictionary.getByTokenContractAddress(item.collateralToken)
                .asset
            }
          />
        ),
        interestAPR: (
          <InterestAPR
            interestPerDay={item.interestOwedPerDay}
            principal={item.principal}
          />
        ),
        endTimestamp: <DisplayDate timestamp={item.endTimestamp} />,
        actions: (
          <div className="d-flex flex-row flex-nowrap justify-content-between">
            <div className="mr-1">
              <StyledRepayButton
                onClick={() => dispatch(actions.openRepayModal(item.loanId))}
              >
                Repay
              </StyledRepayButton>
            </div>
          </div>
        ),
      };
    });
  }, [props.data, dispatch]);
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
    </div>
  );
}

const StyledRepayButton = styled.button.attrs(_ => ({ type: 'button' }))`
  border: 2px solid var(--green);
  width: 77px;
  height: 32px;
  color: var(--green);
  background-color: var(--primary);
  border-radius: 8px;
`;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, useSortBy } from 'react-table';
import { Icon, Text } from '@blueprintjs/core';
import { translations } from 'locales/i18n';

import { BorrowAmount } from '../../components/ActiveBorrowTable/BorrowAmount';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { CollateralAmount } from '../../components/ActiveBorrowTable/CollateralAmount';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { useGetContractPastEvents } from '../../hooks/useGetContractPastEvents';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';

interface Props {}

export function BorrowHistory(props: Props) {
  const { t } = useTranslation();

  const { events, loading } = useGetContractPastEvents(
    'sovrynProtocol',
    'Borrow',
  );

  const columns = React.useMemo(
    () => [
      {
        Header: t(translations.borrowHistory.table.headers.borrowAmount),
        accessor: 'borrowAmount',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: t(translations.borrowHistory.table.headers.collateralAmount),
        accessor: 'collateralAmount',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: t(translations.borrowHistory.table.headers.interestAPR),
        accessor: 'interestAPR',
        sortable: true,
      },
      {
        Header: t(translations.borrowHistory.table.headers.timestamp),
        accessor: 'timestamp',
        sortable: true,
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ],
    [t],
  );
  const data = React.useMemo(() => {
    return events.map(item => {
      const timestamp = String(
        // EventData is incorrectly typed in web3-eth-contract
        new Date((item as any).eventDate).getTime() / 1e3,
      );
      return {
        id: item.returnValues.loanId,
        borrowAmount: (
          <BorrowAmount
            amount={item.returnValues.newPrincipal}
            asset={
              AssetsDictionary.getByTokenContractAddress(
                item.returnValues.loanToken,
              ).asset
            }
          />
        ),
        collateralAmount: (
          <CollateralAmount
            amount={item.returnValues.newCollateral}
            asset={
              AssetsDictionary.getByTokenContractAddress(
                item.returnValues.collateralToken,
              ).asset
            }
          />
        ),
        interestAPR: <>{weiToFixed(item.returnValues.interestRate, 2)} %</>,
        timestamp: <DisplayDate timestamp={timestamp} />,
      };
    });
  }, [events]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);
  return (
    <div className="sovryn-border tw-p-4 tw-table-responsive">
      <table {...getTableProps()} className="sovryn-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Text ellipsize tagName="span">
                    {column.render('Header')}
                    {column.sortable && (
                      <span className="tw-mx-1">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <Icon
                              icon="sort-desc"
                              className="tw-text-sov-white"
                              iconSize={15}
                            />
                          ) : (
                            <Icon
                              icon="sort-asc"
                              className="tw-text-sov-white"
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
                    <td className="tw-align-middle" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {rows.length === 0 && !loading && (
            <tr>
              <td colSpan={99}>{t(translations.borrowHistory.no_items)}</td>
            </tr>
          )}
          {rows.length === 0 && loading && (
            <tr>
              <td colSpan={99}>
                <SkeletonRow />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

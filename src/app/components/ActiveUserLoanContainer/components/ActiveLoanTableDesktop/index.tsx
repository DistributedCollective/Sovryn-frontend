import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { ActiveLoanExpandedRow } from '../ActiveLoanExpandedRow';
import { Icon } from '@blueprintjs/core';
import { Text } from '@blueprintjs/core';

interface Props {
  data: any;
  setExpandedId: any;
  setExpandedItem: any;
  expandedId: any;
  expandedItem: any;
}

export function ActiveLoanTableDesktop(props: Props) {
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
  const data = props.data;
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
              row.id === props.expandedId ? (
                <ActiveLoanExpandedRow
                  data={props.expandedItem}
                  key={props.expandedId}
                  handleClick={() => props.setExpandedId('')}
                />
              ) : (
                <tr
                  {...row.getRowProps()}
                  onClick={() => {
                    props.setExpandedItem(data[row.id]);
                    props.setExpandedId(row.id);
                  }}
                  style={{
                    opacity: props.expandedId ? '0.2' : '1',
                    border: props.expandedId ? 'none' : '',
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
    </div>
  );
}

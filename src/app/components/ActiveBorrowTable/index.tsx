import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { Icon, Text } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@blueprintjs/core';

import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { actions } from 'app/pages/BorrowPage/slice';

import { InterestAPR } from '../ActiveUserLoanContainer/components/InterestAPR';
import { DisplayDate } from '../ActiveUserLoanContainer/components/DisplayDate';
import { BorrowAmount } from './BorrowAmount';
import { CollateralAmount } from './CollateralAmount';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useMaintenance } from '../../hooks/useMaintenance';
import { ActionButton } from '../Form/ActionButton';

interface Props {
  data: any;
}

export function ActiveBorrowTable(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const repayLocked = checkMaintenance(States.STOP_BORROW);
  const addingLocked = checkMaintenance(States.ADD_TO_MARGIN_TRADES);

  const columns = React.useMemo(
    () => [
      {
        Header: t(translations.activeBorrowTable.headers.borrowAmount),
        accessor: 'borrowAmount',
        sortType: 'alphanumeric',
        headerProps: {
          className: 'test',
        },
        sortable: true,
      },
      {
        Header: t(translations.activeBorrowTable.headers.collateralAmount),
        accessor: 'collateralAmount',
        sortType: 'alphanumeric',
        sortable: true,
      },
      {
        Header: t(translations.activeBorrowTable.headers.interestAPR),
        accessor: 'interestAPR',
        sortable: true,
      },
      {
        Header: t(translations.activeBorrowTable.headers.endTimestamp),
        accessor: 'endTimestamp',
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
          <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-end tw-space-x-2">
            {repayLocked ? (
              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={<>{t(translations.maintenance.stopBorrow)}</>}
              >
                <ActionButton
                  text={t(translations.activeBorrowTable.repayButton)}
                  disabled
                />
              </Tooltip>
            ) : (
              <ActionButton
                text={t(translations.activeBorrowTable.repayButton)}
                onClick={() => dispatch(actions.openRepayModal(item.loanId))}
              />
            )}

            {addingLocked ? (
              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={<>{t(translations.maintenance.addCollateralBorrow)}</>}
              >
                <ActionButton
                  text={t(translations.activeBorrowTable.addCollateralButton)}
                  disabled
                />
              </Tooltip>
            ) : (
              <ActionButton
                text={t(translations.activeBorrowTable.addCollateralButton)}
                onClick={() => dispatch(actions.openAddModal(item.loanId))}
              />
            )}
          </div>
        ),
      };
    });
  }, [props.data, repayLocked, t, addingLocked, dispatch]);

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
        </tbody>
      </table>
    </div>
  );
}

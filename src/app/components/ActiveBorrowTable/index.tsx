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
import classNames from 'classnames';

interface Props {
  data: any;
}

export function ActiveBorrowTable(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const isRepayDisabled = checkMaintenance(States.STOP_BORROW);
  const isIncreaseCollateralDisabled = checkMaintenance(
    States.DEPOSIT_COLLATERAL_BORROW,
  );

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
      let repayButton = (
        <button
          type="button"
          className={classNames(
            'tw-w-20 tw-min-h-8 tw-mr-4 tw-px-2 tw-py-1 tw-text-success tw-leading-tight tw-bg-gray-1 tw-border-2 tw-border-success tw-rounded-lg hover:tw-border-opacity-75',
            isRepayDisabled && 'tw-cursor-not-allowed tw-opacity-0.25',
          )}
          onClick={() => dispatch(actions.openRepayModal(item.loanId))}
        >
          {t(translations.activeBorrowTable.repayButton)}
        </button>
      );

      if (isRepayDisabled) {
        repayButton = (
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>{t(translations.maintenance.stopBorrow)}</>}
          >
            {repayButton}
          </Tooltip>
        );
      }

      let depositCollateralButton = (
        <button
          type="button"
          className={classNames(
            'tw-min-h-8 tw-px-2 tw-py-1 tw-text-secondary tw-leading-tight tw-bg-gray-1 tw-border-2 tw-border-secondary tw-rounded-lg hover:tw-border-opacity-75',
            isIncreaseCollateralDisabled &&
              'tw-cursor-not-allowed tw-opacity-0.25',
          )}
          onClick={() => dispatch(actions.openDepositCollateral(item.loanId))}
        >
          {t(translations.activeBorrowTable.depositCollateralButton)}
        </button>
      );

      if (isIncreaseCollateralDisabled) {
        depositCollateralButton = (
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>{t(translations.maintenance.stopBorrow)}</>}
          >
            {depositCollateralButton}
          </Tooltip>
        );
      }

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
          <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-end">
            {repayButton}
            {depositCollateralButton}
          </div>
        ),
      };
    });
  }, [props.data, dispatch, t, isRepayDisabled, isIncreaseCollateralDisabled]);

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

import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { Icon, Text } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { Tooltip } from '@blueprintjs/core';

import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { actions } from 'app/containers/LendBorrowSovryn/slice';

import { InterestAPR } from '../ActiveUserLoanContainer/components/InterestAPR';
import { DisplayDate } from '../ActiveUserLoanContainer/components/DisplayDate';
import { BorrowAmount } from './BorrowAmount';
import { CollateralAmount } from './CollateralAmount';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useMaintenance } from '../../hooks/useMaintenance';

interface Props {
  data: any;
}

export function ActiveBorrowTable(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const repayLocked = checkMaintenance(States.STOP_BORROW);

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
          <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-between">
            <div className="tw-mr-1">
              {repayLocked ? (
                <Tooltip
                  position="bottom"
                  hoverOpenDelay={0}
                  hoverCloseDelay={0}
                  interactionKind="hover"
                  content={<>{t(translations.maintenance.stopBorrow)}</>}
                >
                  <StyledRepayButton className="tw-opacity-50 tw-cursor-not-allowed">
                    {t(translations.activeBorrowTable.repayButton)}
                  </StyledRepayButton>
                </Tooltip>
              ) : (
                <StyledRepayButton
                  onClick={() => dispatch(actions.openRepayModal(item.loanId))}
                >
                  {t(translations.activeBorrowTable.repayButton)}
                </StyledRepayButton>
              )}
            </div>
          </div>
        ),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, dispatch, t]);
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
                              className="tw-text-white"
                              iconSize={15}
                            />
                          ) : (
                            <Icon
                              icon="sort-asc"
                              className="tw-text-white"
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

const StyledRepayButton = styled.button.attrs(_ => ({ type: 'button' }))`
  border: 2px solid var(--green);
  width: 77px;
  height: 32px;
  color: var(--green);
  background-color: var(--primary);
  border-radius: 8px;
`;

/**
 *
 * ActiveLoanTable
 *
 */
import React from 'react';
import { Cell, Column, Table } from '@blueprintjs/table';
import { weiTo2 } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { useBorrowInterestRate } from '../../hooks/trading/useBorrowInterestRate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleDown,
  faArrowCircleUp,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  data: any;
}

export function ActiveLoanTable(props: Props) {
  const date = (timestamp: string) =>
    new Date(Number(timestamp) * 1e3).toLocaleString('en-GB', {
      timeZone: 'GMT',
    });

  const positionSize = () =>
    props.data.map(item => (
      <Cell>
        {parseFloat(weiTo2(item.collateral)).toLocaleString('en')}{' '}
        {symbolByTokenAddress(item.collateralToken)}
      </Cell>
    ));

  const iconRenderer = () =>
    props.data.map(item => (
      <Cell>
        <FontAwesomeIcon
          className="d-inline-block h-100 ml-2 pb-1 text-customOrange"
          icon={faArrowCircleDown}
        />
      </Cell>
    ));

  const currentMargin = (rowIndex: number) => {
    return <Cell>{weiTo2(props.data[rowIndex].currentMargin)}%</Cell>;
  };

  const interestAPR = () => props.data.map(item => <Cell>todo</Cell>);

  const startPrice = () => props.data.map(item => <Cell>todo</Cell>);

  const endDate = () =>
    props.data.map(item => <Cell>{date(item.endTimestamp)} GMT</Cell>);

  const testCell = () => <Cell>hello</Cell>;

  return (
    <>
      {props.data && (
        <Table numRows={props.data}>
          <Column
            name="Position Size"
            cellRenderer={(rowIndex: number) => {
              return (
                <Cell>
                  {parseFloat(
                    weiTo2(props.data[rowIndex].collateral),
                  ).toLocaleString('en')}{' '}
                  {symbolByTokenAddress(props.data[rowIndex].collateralToken)}
                </Cell>
              );
            }}
          />
          <Column
            name="Current Margin"
            cellRenderer={(rowIndex: number) => {
              return <Cell>{weiTo2(props.data[rowIndex].currentMargin)}%</Cell>;
            }}
          />
          <Column
            name="Interest APR"
            cellRenderer={(rowIndex: number) => {
              return <Cell>todo</Cell>;
            }}
          />
          <Column
            name="Start Price"
            cellRenderer={(rowIndex: number) => {
              return <Cell>todo</Cell>;
            }}
          />
          <Column
            name="End Date/Time"
            cellRenderer={(rowIndex: number) => {
              return <Cell>{date(props.data[rowIndex].endTimestamp)} GMT</Cell>;
            }}
          />
        </Table>
      )}
    </>
  );
}

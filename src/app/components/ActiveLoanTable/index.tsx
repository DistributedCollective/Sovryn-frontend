/**
 *
 * ActiveLoanTable
 *
 */
import React from 'react';
import DataTable from 'react-data-table-component';
import { weiTo4, weiTo2 } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { useBorrowInterestRate } from '../../hooks/trading/useBorrowInterestRate';

interface Props {
  data: any;
}

export function ActiveLoanTable(props: Props) {
  const date = (timestamp: string) =>
    new Date(Number(timestamp) * 1e3).toLocaleString('en-GB', {
      timeZone: 'GMT',
    });
  const data = props.data.map(item => {
    console.log(item);
    return {
      icon: 'todo',
      positionSize: `${parseFloat(weiTo2(item.collateral)).toLocaleString(
        'en',
      )} ${symbolByTokenAddress(item.collateralToken)}`,
      currentMargin: `${weiTo2(item.currentMargin)}%`,
      interestAPR: 'todo',
      startPrice: 'todo',
      endTime: `${date(item.endTimestamp)} GMT`,
    };
  });

  const columns = [
    {
      name: '',
      selector: 'icon',
      sortable: false,
      right: true,
    },
    {
      name: 'Position Size',
      selector: 'positionSize',
      sortable: true,
      right: true,
    },
    {
      name: 'Current Margin',
      selector: 'currentMargin',
      sortable: true,
      right: true,
    },
    {
      name: 'Interest APR',
      selector: 'interestAPR',
      sortable: false,
      right: true,
    },
    {
      name: 'Start Price',
      selector: 'startPrice',
      sortable: false,
      right: true,
    },
    {
      name: 'End Date & Time',
      selector: 'endTime',
      sortable: true,
      right: true,
    },
  ];

  const customStyles = {
    cells: {
      style: {
        backgroundColor: 'yellow',
      },
    },
    headCells: {
      style: {
        border: '5px solid green',
        fontSize: '14px',
        color: '#586c86',
      },
    },
  };

  return (
    <DataTable
      className="dataTable"
      title="Active Loans"
      columns={columns}
      data={data}
      striped={true}
      customStyles={customStyles}
    />
  );
}

import React, { useState } from 'react';
import { Table, TablePaginationConfig } from 'antd';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { tempTransactions } from './constants';

interface Props {
  title: string;
}

interface tableDataSourceProps {
  id: number;
  date?: string;
  sendAsset?: string;
  sendAmount?: number;
  receiveAsset?: string;
  receiveAmount?: number;
  transactionFee?: number;
  status?: string;
  hash?: string;
}

const defaultPagination: TablePaginationConfig = {
  current: 1,
  pageSize: 9,
  total: 0,
  position: ['bottomCenter'],
};

const assetsList = AssetsDictionary.list();

export function SwapHistoryTable({ title }: Props) {
  const [pagination, setPagination] = useState(defaultPagination);

  const handleTableChange = (_pagination: TablePaginationConfig) => {
    setPagination(_pagination);
  };

  const getAssetIcon = (assetName: string) => {
    const selectedAsset = assetsList.find(row => row.symbol === assetName);
    return selectedAsset?.logoSvg || '';
  };

  const columns = [
    {
      title: 'Date/Time',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      render: (date: string) => {
        return (
          <div className="transaction-date-time">
            <div>{date}</div>
            <div>{`21:21 CET`}</div>
          </div>
        );
      },
    },
    {
      title: 'Sending Asset',
      dataIndex: 'sendAsset',
      key: 'sendAsset',
      width: '15%',
      render: (sendAsset: string) => {
        return (
          <div className="transaction-send-asset d-flex">
            <div className="transaction-send-asset__image">
              <img src={getAssetIcon(sendAsset)} alt="asset" />
            </div>
            <div className="transaction-send-asset__name">{sendAsset}</div>
          </div>
        );
      },
    },
    {
      title: 'Amount Sent',
      dataIndex: 'sendAmount',
      key: 'sendAmount',
      width: '15%',
      render: (sendAmount: number, row: tableDataSourceProps) => {
        return (
          <div className="transaction-send-amount">
            <div className="transaction-send-amount__origin">
              {`${sendAmount} ${row.sendAsset}`}
            </div>
            <div className="transaction-send-amount__usd">
              {`≈ ${sendAmount} USD`}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Receiving Asset',
      dataIndex: 'receiveAsset',
      key: 'receiveAsset',
      width: '15%',
      render: (receiveAsset: string) => {
        return (
          <div className="transaction-receive-asset d-flex">
            <div className="transaction-receive-asset__image">
              <img src={getAssetIcon(receiveAsset)} alt="asset" />
            </div>
            <div className="transaction-receive-asset__name">
              {receiveAsset}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Amount Received',
      dataIndex: 'receiveAmount',
      key: 'receiveAmount',
      width: '15%',
      render: (receiveAmount: number, row: tableDataSourceProps) => {
        return (
          <div className="transaction-receive-amount">
            <div className="transaction-receive-amount__origin">
              {`${receiveAmount} ${row.receiveAsset}`}
            </div>
            <div className="transaction-receive-amount__usd">
              {`≈ ${receiveAmount} USD`}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Transaction Fee',
      dataIndex: 'transactionFee',
      key: 'transactionFee',
      width: '15%',
      render: (transactionFee: number, row: tableDataSourceProps) => {
        return (
          <div className="transaction-fee-amount">
            <div className="transaction-fee-amount__origin">
              {`${transactionFee} ${row.sendAsset}`}
            </div>
            <div className="transaction-fee-amount__usd">
              {`≈ ${transactionFee} USD`}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string, row: tableDataSourceProps) => {
        return (
          <div>
            <div className="transaction-status">{status}</div>
            <div className="transaction-hash">{row.hash}</div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="swap-history-table">
      <div className="swap-history-table__title">{title}</div>
      <div className="swap-history-table__content">
        <Table
          rowClassName={(_record, index) =>
            index % 2 === 0
              ? 'history-table-row-light'
              : 'history-table-row-dark'
          }
          columns={columns}
          rowKey={record => record.id}
          dataSource={tempTransactions}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}

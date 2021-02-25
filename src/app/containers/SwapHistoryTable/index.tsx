import React, { useState } from 'react';
import { Table, TablePaginationConfig } from 'antd';
import { EventData } from 'web3-eth-contract';
import moment from 'moment';
import { Tooltip } from '@blueprintjs/core';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { useAccount } from 'app/hooks/useAccount';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import { weiTo2, weiTo18 } from 'utils/blockchain/math-helpers';
import { prettyTx } from 'utils/helpers';
import { Asset } from '../../../types/asset';
import { weiToNumberFormat } from 'utils/display-text/format';

interface Props {
  title: string;
}

interface TableDataSourceProps {
  id: number;
  date?: string;
  sendAsset?: string;
  sendAmount?: string;
  receiveAsset?: string;
  receiveAmount?: string;
  transactionFee?: string;
  status?: string;
  hash?: string;
}
interface EventReturnValuesProps {
  _fromAmount?: string;
  _fromToken?: string;
  _smartToken?: string;
  _toAmount?: string;
  _toToken?: string;
  _trader?: string;
}

const defaultPagination: TablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0,
  position: ['bottomCenter'],
};

const assetsList = AssetsDictionary.list();

export function SwapHistoryTable({ title }: Props) {
  const [pagination, setPagination] = useState(defaultPagination);
  const address = useAccount();

  const swapStates = useGetContractPastEvents('swapNetwork', 'Conversion', {
    _trader: address,
  });

  const formatTransactions = (states): TableDataSourceProps[] => {
    if (address.length === 0) return [];
    const events: EventData[] = states.events;

    return events.map((row: any, index: number) => {
      const returnValues: EventReturnValuesProps = row.returnValues;
      const _fromToken = returnValues._fromToken || '';
      const _fromAmount = returnValues._fromAmount || '';
      const _toToken = returnValues._toToken || '';
      const _toAmount = returnValues._toAmount || '';
      const fromAsset = symbolByTokenAddress(_fromToken);
      const toAsset = symbolByTokenAddress(_toToken);

      return {
        id: index,
        date: row.eventDate || '',
        sendAsset: fromAsset,
        sendAmount: _fromAmount,
        receiveAsset: toAsset,
        receiveAmount: _toAmount,
        hash: row.transactionHash,
      };
    });
  };

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
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      width: '15%',
      render: (date: string) => {
        const formatDate = new Date(date).toLocaleString('en-GB', {
          timeZone: 'GMT',
        });

        return (
          <div className="transaction-date-time">
            <div>{formatDate.split(',')[0]}</div>
            <div>{`${formatDate.split(',')[1]} GMT`}</div>
          </div>
        );
      },
    },
    {
      title: 'Sending Asset',
      dataIndex: 'sendAsset',
      key: 'sendAsset',
      sorter: (a, b) =>
        a.sendAsset.toLowerCase() <= b.sendAsset.toLowerCase() ? -1 : 1,
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
      sorter: (a, b) => (Number(a.sendAmount) <= Number(b.sendAmount) ? -1 : 1),
      width: '20%',
      render: (sendAmount: string, row: TableDataSourceProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { value: price } = useBorrowAssetPrice(
          Asset[(row.sendAsset || 'USDT').toUpperCase()],
          Asset.USDT,
        );
        const sendAssetPrice = weiTo2(price);
        const sendAmountInUSD = (
          Number(weiToNumberFormat(sendAmount, 4)) * Number(sendAssetPrice)
        ).toFixed(2);

        return (
          <div className="transaction-send-amount">
            <div className="transaction-send-amount__origin">
              <Tooltip content={weiTo18(sendAmount)}>
                <span>{`${weiToNumberFormat(sendAmount, 4)} ${
                  row.sendAsset
                }`}</span>
              </Tooltip>
            </div>
            <div className="transaction-send-amount__usd">
              {`≈ ${sendAmountInUSD} USD`}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Receiving Asset',
      dataIndex: 'receiveAsset',
      key: 'receiveAsset',
      sorter: (a, b) =>
        a.receiveAsset.toLowerCase() <= b.receiveAsset.toLowerCase() ? -1 : 1,
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
      sorter: (a, b) =>
        Number(a.receiveAmount) <= Number(b.receiveAmount) ? -1 : 1,
      width: '20%',
      render: (receiveAmount: number, row: TableDataSourceProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { value: price } = useBorrowAssetPrice(
          Asset[(row.receiveAsset || 'USDT').toUpperCase()],
          Asset.USDT,
        );
        const receiveAssetPrice = weiTo2(price);
        const receiveAmountInUSD = (
          Number(weiToNumberFormat(receiveAmount, 4)) *
          Number(receiveAssetPrice)
        ).toFixed(2);

        return (
          <div className="transaction-receive-amount">
            <div className="transaction-receive-amount__origin">
              <Tooltip content={weiTo18(receiveAmount)}>
                {`${weiToNumberFormat(receiveAmount, 4)} ${row.receiveAsset}`}
              </Tooltip>
            </div>
            <div className="transaction-receive-amount__usd">
              {`≈ ${receiveAmountInUSD} USD`}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Transaction Hash',
      dataIndex: 'hash',
      key: 'hash',
      sorter: (a, b) => (a.hash.toLowerCase() <= b.hash.toLowerCase() ? -1 : 1),
      width: '15%',
      render: (hash: string) => {
        return (
          <div className="transaction-hash">
            <Tooltip content={hash}>{prettyTx(hash || '', 4, 5)}</Tooltip>
          </div>
        );
      },
    },
  ];

  const transactions: TableDataSourceProps[] = formatTransactions(swapStates);

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
          dataSource={transactions}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}

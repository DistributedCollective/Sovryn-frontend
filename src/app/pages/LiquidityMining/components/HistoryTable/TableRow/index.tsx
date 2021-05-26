import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import React from 'react';
import { LiquidityPool } from 'utils/models/liquidity-pool';
import { TablePoolRenderer } from '../../../../../components/FinanceV2Components/TablePoolRenderer/index';
import { TableTransactionStatus } from '../../../../../components/FinanceV2Components/TableTransactionStatus/index';
import { TxStatus } from 'store/global/transactions-store/types';

interface ITableRowProps {
  pool: LiquidityPool;
  time: string;
  type: string;
  amount: string;
  txHash: string;
}

export const TableRow: React.FC<ITableRowProps> = ({
  pool,
  time,
  type,
  amount,
  txHash,
}) => (
  <tr className="tw-text-xs">
    <td>
      <DisplayDate timestamp={new Date(time).getTime().toString()} />
    </td>
    <td>
      <TablePoolRenderer
        asset={pool.supplyAssets[0].asset}
        secondaryAsset={pool.supplyAssets[1].asset}
      />
    </td>
    <td>{type}</td>
    <td>{pool.supplyAssets[1].asset}</td>
    <td>
      {amount} {pool.supplyAssets[1].asset}
    </td>
    <td>
      <LinkToExplorer
        txHash={txHash}
        className="text-gold font-weight-normal text-nowrap"
        startLength={5}
        endLength={5}
      />
    </td>

    <td>
      <TableTransactionStatus transactionStatus={TxStatus.CONFIRMED} />
    </td>
  </tr>
);

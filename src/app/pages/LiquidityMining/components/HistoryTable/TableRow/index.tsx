import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import React from 'react';
import { LiquidityPool } from 'utils/models/liquidity-pool';
import { TablePoolRenderer } from '../../../../../components/FinanceV2Components/TablePoolRenderer/index';
import { TableTransactionStatus } from '../../../../../components/FinanceV2Components/TableTransactionStatus/index';
import { TxStatus } from 'store/global/transactions-store/types';

interface ITableRowProps {
  pool: LiquidityPool;
}

export const TableRow: React.FC<ITableRowProps> = ({ pool }) => (
  <tr className="tw-text-xs">
    <td>
      <DisplayDate timestamp={new Date().getTime().toString()} />
    </td>
    <td>
      <TablePoolRenderer
        asset={pool.supplyAssets[0].asset}
        secondaryAsset={pool.supplyAssets[1].asset}
      />
    </td>
    <td>Deposit</td>
    <td>{pool.supplyAssets[1].asset}</td>
    <td>+10.000 {pool.supplyAssets[1].asset}</td>
    <td>
      <LinkToExplorer
        txHash="0x4130000089054"
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

import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import React from 'react';
import { TablePoolRenderer } from '../../../../../components/FinanceV2Components/TablePoolRenderer';
import { TableTransactionStatus } from '../../../../../components/FinanceV2Components/TableTransactionStatus/index';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

interface ITableRowProps {
  time: number;
  type: string;
  amount: string;
  txHash: string;
  asset: Asset;
}

export const TableRow: React.FC<ITableRowProps> = ({
  time,
  type,
  amount,
  txHash,
  asset,
}) => {
  return (
    <tr className="tw-text-xs">
      <td>
        <DisplayDate timestamp={new Date(time).getTime().toString()} />
      </td>
      <td>
        <TablePoolRenderer asset={asset} />
      </td>
      <td>{type}</td>
      <td>
        {amount} <AssetSymbolRenderer asset={asset} />
      </td>
      <td>
        <LinkToExplorer
          txHash={txHash}
          className="tw-text-gold tw-font-normal tw-whitespace-nowrap"
          startLength={5}
          endLength={5}
        />
      </td>

      <td>
        <TableTransactionStatus transactionStatus={TxStatus.CONFIRMED} />
      </td>
    </tr>
  );
};

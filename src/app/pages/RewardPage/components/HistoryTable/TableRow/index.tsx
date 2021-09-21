import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import React from 'react';
import { TableTransactionStatus } from '../../../../../components/FinanceV2Components/TableTransactionStatus/index';
import { TxStatus } from 'store/global/transactions-store/types';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';

interface ITableRowProps {
  time: number;
  type: string;
  amount: string;
  txHash: string;
}

export const TableRow: React.FC<ITableRowProps> = ({
  time,
  type,
  amount,
  txHash,
}) => {
  return (
    <tr className="tw-text-xs">
      <td>
        <DisplayDate timestamp={new Date(time).getTime().toString()} />
      </td>
      <td>{type}</td>
      <td>
        {amount} <AssetSymbolRenderer asset={Asset.SOV} />
      </td>
      <td>
        <LinkToExplorer
          txHash={txHash}
          className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
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

import React from 'react';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { TableTransactionStatus } from 'app/components/FinanceV2Components/TableTransactionStatus/index';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

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
        <DisplayDate timestamp={time.toString()} />
      </td>
      <td>{type}</td>
      <td>
        <AssetValue
          value={Number(amount)}
          assetString={asset}
          mode={AssetValueMode.auto}
          minDecimals={8}
          maxDecimals={8}
          useTooltip
        />
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

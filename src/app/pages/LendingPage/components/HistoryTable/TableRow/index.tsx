import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import React from 'react';
import { TablePoolRenderer } from '../../../../../components/FinanceV2Components/TablePoolRenderer';
import { TableTransactionStatus } from '../../../../../components/FinanceV2Components/TableTransactionStatus/index';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Tooltip } from '@blueprintjs/core';

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
        <Tooltip
          content={
            <>
              {Number(amount).toFixed(12)} <AssetSymbolRenderer asset={asset} />
            </>
          }
        >
          <>
            {Number(amount).toFixed(4)} <AssetSymbolRenderer asset={asset} />
          </>
        </Tooltip>
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

import React from 'react';

import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';

import { TableTransactionStatus } from '../../../../../components/FinanceV2Components/TableTransactionStatus/index';
import { Tooltip } from '@blueprintjs/core';
import { weiTo18, weiToFixed } from 'utils/blockchain/math-helpers';

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
        <DisplayDate timestamp={new Date(Number(time)).getTime().toString()} />
      </td>
      <td>{type}</td>
      <td>
        <Tooltip content={`${weiTo18(amount)} SOV`}>
          <>
            {weiToFixed(amount, 8)}{' '}
            <span className="tw--ml-0.5 tw-mr-1">...</span>{' '}
            <AssetSymbolRenderer asset={Asset.SOV} />
          </>
        </Tooltip>
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

import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LiquidityPool } from 'utils/models/liquidity-pool';
import { TablePoolRenderer } from '../../../../../components/FinanceV2Components/TablePoolRenderer/index';
import { TableTransactionStatus } from '../../../../../components/FinanceV2Components/TableTransactionStatus/index';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';

interface ITableRowProps {
  pool: LiquidityPool;
  time: number;
  type: string;
  amount: string;
  txHash: string;
  asset: Asset;
}

export const TableRow: React.FC<ITableRowProps> = ({
  pool,
  time,
  type,
  amount,
  txHash,
  asset,
}) => {
  const { t } = useTranslation();

  return (
    <tr className="tw-text-xs">
      <td>
        <DisplayDate timestamp={new Date(time).getTime().toString()} />
      </td>
      <td>
        <TablePoolRenderer
          asset={pool?.supplyAssets[0]?.asset}
          secondaryAsset={pool?.supplyAssets[1]?.asset}
        />
      </td>
      <td>
        {type === 'Added'
          ? t(translations.liquidityMining.historyTable.txType.added)
          : type === 'Removed' &&
            t(translations.liquidityMining.historyTable.txType.removed)}
      </td>
      <td>{asset}</td>
      <td>
        {amount} {asset}
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

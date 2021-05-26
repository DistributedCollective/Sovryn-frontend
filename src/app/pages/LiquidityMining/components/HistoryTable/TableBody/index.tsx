import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import React from 'react';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { TableRow } from '../TableRow/index';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
interface ITableBodyProps {
  items: any[];
  loading: Boolean;
}

export const TableBody: React.FC<ITableBodyProps> = ({ items, loading }) => {
  const { t } = useTranslation();

  return (
    <tbody className="mt-5">
      {items.map((item, index) => (
        <TableRow
          key={`${item.poolAsset}/${index}`}
          pool={LiquidityPoolDictionary.get(
            AssetsDictionary.getByAmmContractAddress(item.pool)?.asset,
          )}
          time={item.time}
          txHash={item.txHash}
          amount={weiToFixed(item.amount, 4)}
          type={item.type}
          asset={AssetsDictionary.getByTokenContractAddress(item.asset).asset}
        />
      ))}

      {loading && (
        <tr key={'loading'}>
          <td colSpan={99}>
            <SkeletonRow loadingText={t(translations.topUpHistory.loading)} />
          </td>
        </tr>
      )}
      {items.length === 0 && !loading && (
        <tr key={'empty'}>
          <td className="text-center" colSpan={99}>
            {t(translations.liquidityMining.historyTable.emptyState)}
          </td>
        </tr>
      )}
    </tbody>
  );
};

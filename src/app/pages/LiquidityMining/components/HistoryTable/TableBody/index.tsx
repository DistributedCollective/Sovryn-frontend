import React from 'react';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { TableRow } from '../TableRow/index';

export const TableBody: React.FC = () => {
  const pools = LiquidityPoolDictionary.list();

  return (
    <tbody className="mt-5">
      {pools.map((item, index) => (
        <TableRow
          key={`${item.supplyAssets[0].asset}/${item.supplyAssets[1].asset}/${index}`}
          pool={item}
        />
      ))}

      {/* {loading && (
              <tr key={'loading'}>
                <td colSpan={99}>
                  <SkeletonRow
                    loadingText={t(translations.topUpHistory.loading)}
                  />
                </td>
              </tr>
            )}
            {history.length === 0 && !loading && (
              <tr key={'empty'}>
                <td className="text-center" colSpan={99}>
                  History is empty.
                </td>
              </tr>
            )} */}
    </tbody>
  );
};

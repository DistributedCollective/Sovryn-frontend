import React from 'react';
import { Asset } from '../../../../../types';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { RowTable } from '../../../../components/FinanceV2Components/RowTable';
import { TableBody } from '../../../../components/FinanceV2Components/RowTable/TableBody';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PoolTokenRewards } from '../MiningPool/PoolTokenRewards';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface ILiquidityMiningRowTableProps {
  pool: AmmLiquidityPool;
  balance1: string;
  loading1: boolean;
  balance2: string;
  loading2: boolean;
  asset1: Asset;
  asset2: Asset;
  pln1: string;
  pln2: string;
  plnLoading: boolean;
  totalEarned: string;
}

export const LiquidityMiningRowTable: React.FC<ILiquidityMiningRowTableProps> = ({
  pool,
  balance1,
  balance2,
  loading1,
  loading2,
  asset1,
  asset2,
  pln1,
  pln2,
  totalEarned,
  plnLoading,
}) => {
  const { t } = useTranslation();

  return (
    <RowTable className="tw-w-full tw-max-w-80 2xl:tw-max-w-96 ">
      <thead className="tw-text-sm tw-tracking-normal">
        <tr>
          <th className="tw-pb-2 tw-font-light">
            {t(translations.liquidityMining.rowTable.tableHeaders.balance)}
          </th>
          <th className="tw-pb-2 tw-font-light">
            {t(translations.liquidityMining.rowTable.tableHeaders.rewards)}
          </th>
        </tr>
      </thead>

      <TableBody>
        {balance1 === '0' && balance2 === '0' ? (
          <td colSpan={4} className="tw-italic tw-font-light tw-text-center">
            {t(translations.liquidityMining.rowTable.noLiquidityProvided)}
          </td>
        ) : (
          <>
            <td>
              <div>
                <LoadableValue
                  loading={loading1}
                  value={
                    <>
                      {weiToNumberFormat(balance1, 6)}{' '}
                      <AssetRenderer asset={asset1} />
                    </>
                  }
                />
              </div>
              <div>
                <LoadableValue
                  loading={loading2}
                  value={
                    <>
                      {weiToNumberFormat(balance2, 6)}{' '}
                      <AssetRenderer asset={asset2} />
                    </>
                  }
                />
              </div>
            </td>
            <td>
              <PoolTokenRewards pool={pool} />
            </td>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};

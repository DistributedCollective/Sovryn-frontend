import React from 'react';
import { Asset } from '../../../../../types';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToAssetNumberFormat } from '../../../../../utils/display-text/format';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { RowTable } from '../../../../components/FinanceV2Components/RowTable';
import { TableBody } from '../../../../components/FinanceV2Components/RowTable/TableBody';
import {
  TableBodyData,
  TableHeader,
} from 'app/components/FinanceV2Components/RowTable/styled';
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
          <TableHeader>
            {t(translations.liquidityMining.rowTable.tableHeaders.balance)}
          </TableHeader>
          <TableHeader>
            {t(translations.liquidityMining.rowTable.tableHeaders.rewards)}
          </TableHeader>
        </tr>
      </thead>

      <TableBody>
        {balance1 === '0' && balance2 === '0' ? (
          <td
            colSpan={4}
            className="tw-text-xs tw-italic tw-font-extralight tw-text-center"
          >
            {t(translations.liquidityMining.rowTable.noLiquidityProvided)}
          </td>
        ) : (
          <>
            <TableBodyData>
              <div>
                <LoadableValue
                  loading={loading1}
                  value={
                    <>
                      {weiToAssetNumberFormat(balance1, asset1, 6)}{' '}
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
                      {weiToAssetNumberFormat(balance2, asset2, 6)}{' '}
                      <AssetRenderer asset={asset2} />
                    </>
                  }
                />
              </div>
            </TableBodyData>
            <TableBodyData>
              <PoolTokenRewards pool={pool} />
            </TableBodyData>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};

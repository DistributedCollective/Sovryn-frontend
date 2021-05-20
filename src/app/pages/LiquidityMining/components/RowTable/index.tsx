import React from 'react';
import { Asset } from '../../../../../types/asset';
import type { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { PoolTokenRewards } from '../MiningPool/PoolTokenRewards';
import { RowTable } from '../../../../components/FinanceV2Components/RowTable/index';
import { TableBody } from '../../../../components/FinanceV2Components/RowTable/TableBody/index';
import {
  TableBodyData,
  TableHeader,
} from 'app/components/FinanceV2Components/RowTable/styled';
import { ProfitLossRenderer } from '../../../../components/FinanceV2Components/RowTable/ProfitLossRenderer/index';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface ILiquidityMiningRowTableProps {
  pool: LiquidityPool;
  balance1: string;
  loading1: boolean;
  balance2: string;
  loading2: boolean;
  asset1: Asset;
  asset2: Asset;
}

export const LiquidityMiningRowTable: React.FC<ILiquidityMiningRowTableProps> = ({
  pool,
  balance1,
  balance2,
  loading1,
  loading2,
  asset1,
  asset2,
}) => {
  const { t } = useTranslation();

  return (
    <RowTable>
      <thead className="tw-text-sm">
        <tr>
          <TableHeader isBold={true}>
            {t(translations.liquidityMining.rowTable.tableHeaders.balance)}
          </TableHeader>
          <TableHeader isBold={true}>
            {t(translations.liquidityMining.rowTable.tableHeaders.pl)}
          </TableHeader>
          <TableHeader isBold={true}>
            {t(translations.liquidityMining.rowTable.tableHeaders.rewards)}
          </TableHeader>
          <TableHeader isBold={true}>
            {t(translations.liquidityMining.rowTable.tableHeaders.totalEarned)}
          </TableHeader>
        </tr>
      </thead>

      <TableBody>
        {balance1 === '0' && balance2 === '0' ? (
          <td
            colSpan={5}
            className="tw-text-xs tw-italic tw-font-extralight tw-text-center"
          >
            {t(translations.liquidityMining.rowTable.noLiquidityProvided)}
          </td>
        ) : (
          <>
            <TableBodyData isBold={true}>
              <div>
                <LoadableValue
                  loading={loading1}
                  value={
                    <>
                      {weiToNumberFormat(balance1, 4)}{' '}
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
                      {weiToNumberFormat(balance2, 4)}{' '}
                      <AssetRenderer asset={asset2} />
                    </>
                  }
                />
              </div>
            </TableBodyData>
            <TableBodyData isBold={true}>
              <ProfitLossRenderer isProfit={true} amount="12" asset={asset1} />
              <ProfitLossRenderer isProfit={false} amount="2" asset={asset2} />
            </TableBodyData>
            <TableBodyData isBold={true}>
              <PoolTokenRewards pool={pool} />
            </TableBodyData>
            <TableBodyData isBold={true}>0</TableBodyData>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};

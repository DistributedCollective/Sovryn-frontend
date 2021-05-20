import React from 'react';
import { Asset } from '../../../../../types';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { RowTable } from '../../../../components/FinanceV2Components/RowTable';
import { TableBody } from '../../../../components/FinanceV2Components/RowTable/TableBody';
import {
  TableBodyData,
  TableHeader,
} from 'app/components/FinanceV2Components/RowTable/styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { PoolTokenRewards } from '../MiningPool/PoolTokenRewards';

interface ILiquidityMiningRowTableProps {
  pool: LiquidityPool;
  balance1: string;
  loading1: boolean;
  balance2: string;
  loading2: boolean;
  asset1: Asset;
  asset2: Asset;
  pln1: string;
  pln2: string;
  rewards1: string;
  rewards2: string;
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
  rewards1,
  rewards2,
  totalEarned,
}) => {
  const { t } = useTranslation();

  return (
    <RowTable>
      <thead className="tw-text-sm">
        <tr>
          <TableHeader isBold={true} className="tw-w-1/4">
            {t(translations.liquidityMining.rowTable.tableHeaders.balance)}
          </TableHeader>
          <TableHeader isBold={true} className="tw-w-1/4">
            {t(translations.liquidityMining.rowTable.tableHeaders.pl)}
          </TableHeader>
          <TableHeader isBold={true} className="tw-w-1/4">
            {t(translations.liquidityMining.rowTable.tableHeaders.rewards)}
          </TableHeader>
          <TableHeader isBold={true} className="tw-w-1/4">
            {t(translations.liquidityMining.rowTable.tableHeaders.totalEarned)}
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
            <TableBodyData isBold={true} className="tw-w-1/4">
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
            <TableBodyData isBold={true} className="tw-w-1/4 ">
              <div className="tw-text-green">
                <LoadableValue
                  loading={loading1}
                  value={
                    <>
                      {weiToNumberFormat(pln1, 4)}{' '}
                      <AssetRenderer asset={asset1} />
                    </>
                  }
                />
              </div>
              <div className="tw-text-red">
                <LoadableValue
                  loading={loading2}
                  value={
                    <>
                      {weiToNumberFormat(pln2, 4)}{' '}
                      <AssetRenderer asset={asset2} />
                    </>
                  }
                />
              </div>
            </TableBodyData>
            <TableBodyData isBold={true} className="tw-w-1/4 tw-text-green">
              <PoolTokenRewards pool={pool} />
            </TableBodyData>
            <TableBodyData isBold={true} className="tw-w-1/4 tw-truncate">
              <div className="tw-text-green">
                <LoadableValue
                  loading={loading1 || loading2}
                  value={
                    <>
                      {weiToNumberFormat(totalEarned, 4)}{' '}
                      <AssetRenderer asset={asset1} />
                    </>
                  }
                />
              </div>
            </TableBodyData>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};

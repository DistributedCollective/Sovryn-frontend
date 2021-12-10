import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import type { AmmHistory, ChartData } from './types';
import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface IPoolChartProps {
  pool: AmmLiquidityPool;
  history: AmmHistory;
}

export function PoolChart({ pool, history }: IPoolChartProps) {
  const { t } = useTranslation();
  const [primaryAssetHistory, setPrimaryAssetHistory] = useState<ChartData>([]);
  const [secondaryAssetHistory, setSecondaryAssetHistory] = useState<ChartData>(
    [],
  );
  const [totalHistory, setTotalHistory] = useState<ChartData>([]);

  useEffect(() => {
    if (history?.data && history?.balanceHistory && pool) {
      const { poolTokenA, poolTokenB } = pool;

      const primaryAssetData: ChartData = history.data[poolTokenA]?.map(i => [
        Date.parse(i.activity_date),
        i.APY_pc,
      ]);
      setPrimaryAssetHistory(primaryAssetData);

      //only use secondary asset data for v2 pools, as v1 pools are 50/50 and have same APY for both sides
      if (
        pool.converterVersion === 2 &&
        poolTokenB &&
        history.data[poolTokenB]
      ) {
        const secondaryAssetData: ChartData = history.data[
          poolTokenB
        ]?.map(i => [Date.parse(i.activity_date), i.APY_pc]);
        setSecondaryAssetHistory(secondaryAssetData);
      }
      const total: ChartData = history.balanceHistory?.map(i => [
        Date.parse(i.activity_date),
        i.balance_btc / 1e8,
      ]);
      setTotalHistory(total);
    }
  }, [history, pool]);

  return (
    <>
      {primaryAssetHistory?.length > 0 && totalHistory?.length > 0 && (
        <ComparisonChart
          primaryData={{
            name: `${
              secondaryAssetHistory && secondaryAssetHistory.length > 0
                ? pool.assetA
                : t(translations.liquidity.pool)
            } ${t(translations.liquidity.apy)}`,
            color: getAssetColor(pool.assetA),
            data: primaryAssetHistory,
            numDecimals: 2,
            suffix: '%',
          }}
          secondaryData={
            secondaryAssetHistory?.length > 0
              ? {
                  name: `${pool.assetB} ${t(translations.liquidity.apy)}`,
                  color: getAssetColor(pool.assetB),
                  data: secondaryAssetHistory,
                  numDecimals: 2,
                  suffix: '%',
                }
              : undefined
          }
          totalData={{
            name: t(translations.liquidity.totalLiquidity),
            color: '#ACACAC',
            data: totalHistory,
            numDecimals: 2,
            suffix: '₿', // todo: true for now, but most likely will change
          }}
        />
      )}
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { currentNetwork } from 'utils/classifiers';
import type { LiquidityPool } from 'utils/models/liquidity-pool';
import type { AmmHistory, ChartData } from './types';
import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';

interface Props {
  pool: LiquidityPool;
  history: AmmHistory;
}

export function PoolChart({ pool, history }: Props) {
  const { t } = useTranslation();
  const [btcHistory, setBtcHistory] = useState<ChartData>([]);
  const [assetHistory, setAssetHistory] = useState<ChartData>([]);
  const [totalHistory, setTotalHistory] = useState<ChartData>([]);

  useEffect(() => {
    if (history?.data && history?.balanceHistory && pool) {
      const assetAddress = pool.supplyAssets[0].poolTokens[
        currentNetwork
      ].toLowerCase();
      const btcAddress = pool.supplyAssets[1].poolTokens[
        currentNetwork
      ].toLowerCase();

      const asset: ChartData = history.data[assetAddress]?.map(i => [
        Date.parse(i.activity_date),
        i.APY_pc,
      ]);
      setAssetHistory(asset);

      //only use btc data for v2 pools, as v1 pools are 50/50 and have same APY for both sides
      if (btcAddress !== assetAddress && history.data[btcAddress]) {
        const btc: ChartData = history.data[btcAddress]?.map(i => [
          Date.parse(i.activity_date),
          i.APY_pc,
        ]);
        setBtcHistory(btc);
      }
      const total: ChartData = history.balanceHistory?.map(i => [
        Date.parse(i.activity_date),
        i.balance_btc / 1e8,
      ]);
      setTotalHistory(total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <>
      {assetHistory?.length > 0 && totalHistory?.length > 0 && (
        <ComparisonChart
          primaryData={{
            name: `${
              btcHistory && btcHistory.length > 0
                ? pool.poolAsset
                : t(translations.liquidity.pool)
            } ${t(translations.liquidity.apy)}`,
            color: getAssetColor(pool.poolAsset),
            data: assetHistory,
            numDecimals: 2,
            suffix: '%',
          }}
          secondaryData={
            btcHistory?.length > 0
              ? {
                  name: `rBTC ${t(translations.liquidity.apy)}`,
                  color: '#FFAC3E',
                  data: btcHistory,
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
            suffix: '₿',
          }}
        />
      )}
    </>
  );
}

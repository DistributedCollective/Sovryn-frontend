import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { currentNetwork } from 'utils/classifiers';
import type { LiquidityPool } from 'utils/models/liquidity-pool';
import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';

type ChartDatum = [number, number]; //[unix timestamp, value]
type ChartData = ChartDatum[];

export type PoolData = {
  pool_token: string;
  activity_date: string;
  APY_fees_pc: number;
  APY_rewards_pc: number;
  APY_pc: number;
};

export type PoolBalanceData = {
  activity_date: string;
  balance_btc: number;
  pool: string;
};

export type AmmHistory = {
  pool: string;
  data: {
    [key: string]: PoolData[];
  };
  balanceHistory: PoolBalanceData[];
};

interface Props {
  pool: LiquidityPool;
  history: AmmHistory;
}

export function PoolChart(props: Props) {
  const { t } = useTranslation();
  const [btcHistory, setBtcHistory] = useState<ChartData>([]);
  const [assetHistory, setAssetHistory] = useState<ChartData>([]);
  const [totalHistory, setTotalHistory] = useState<ChartData>([]);

  useEffect(() => {
    if (
      props.history &&
      props.history.data &&
      props.history.balanceHistory &&
      props.pool
    ) {
      const assetAddress = props.pool.supplyAssets[0].poolTokens[
        currentNetwork
      ].toLowerCase();
      const btcAddress = props.pool.supplyAssets[1].poolTokens[
        currentNetwork
      ].toLowerCase();

      const asset: ChartData = props.history.data[assetAddress]?.map(i => [
        Date.parse(i.activity_date),
        i.APY_pc,
      ]);
      setAssetHistory(asset);

      //only use btc data for v2 pools, as v1 pools are 50/50 and have same AER for both sides
      if (btcAddress !== assetAddress && props.history.data[btcAddress]) {
        const btc: ChartData = props.history.data[btcAddress].map(i => [
          Date.parse(i.activity_date),
          i.APY_pc,
        ]);
        setBtcHistory(btc);
      }
      const total: ChartData = props.history.balanceHistory?.map(i => [
        Date.parse(i.activity_date),
        i.balance_btc,
      ]);
      setTotalHistory(total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);

  return (
    <>
      {assetHistory &&
        assetHistory.length > 0 &&
        totalHistory &&
        totalHistory.length > 0 && (
          <ComparisonChart
            primaryData={{
              name: `${
                btcHistory && btcHistory.length > 0
                  ? props.pool.poolAsset
                  : t(translations.liquidity.pool)
              } ${t(translations.liquidity.aer)}`,
              color: getAssetColor(props.pool.poolAsset),
              data: assetHistory,
              numDecimals: 2,
              suffix: '%',
            }}
            secondaryData={
              btcHistory && btcHistory.length > 0
                ? {
                    name: `rBTC ${t(translations.liquidity.aer)}`,
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

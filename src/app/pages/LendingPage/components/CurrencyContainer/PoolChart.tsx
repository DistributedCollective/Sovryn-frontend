import React, { useEffect, useState, useMemo } from 'react';

import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';
import { LendingPool } from 'utils/models/lending-pool';
import { databaseRpcNodes } from 'utils/classifiers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { getLendingContract } from 'utils/blockchain/contract-helpers';

interface Props {
  pool: LendingPool;
}

interface DataItem {
  date: Date;
  supply_apr: number;
  supply: number;
}

export function PoolChart(props: Props) {
  const { chainId } = useSelector(selectWalletProvider);
  const [data, setData] = useState([]);
  const asset = props.pool.getAsset();

  useEffect(() => {
    fetch(databaseRpcNodes[chainId], {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'custom_getLoanTokenHistory',
        params: [
          {
            address: getLendingContract(asset).address,
          },
        ],
      }),
    })
      .then(e => e.json().then())
      .then(e => {
        setData(e.slice(-28)); //last 7 days of data in 6hr chunks
      })
      .catch(console.error);
  }, [asset, chainId, props.pool]);

  const supplyApr: [number, number][] = useMemo(
    () =>
      (data as any[]).map(i => [Date.parse(i.timestamp), i.supply_apr / 1e8]),
    [data],
  );

  const totalLiq: [number, number][] = useMemo(
    () => (data as any[]).map(i => [Date.parse(i.timestamp), i.supply / 1e8]),
    [data],
  );

  const tooltipFormatter = function (this: any) {
    const d = new Date(this.x);
    console.log('this.points: ', this.points);
    return this.points?.reduce(
      function (s, point) {
        return `${s}<br/>${point.series.name}: ${point.y.toFixed(2)}${
          point.series.userOptions?.tooltip?.valueSuffix
        }`;
      },
      `<span class='tw-font-bold'>
        ${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()} ${String(
        d.getUTCHours(),
      ).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC
        </span>`,
    );
  };

  return (
    <>
      <ComparisonChart
        key={data.length}
        primaryData={{
          name: `${asset} APY%`,
          color: getAssetColor(asset),
          numDecimals: 2,
          suffix: '%',
          data: supplyApr,
        }}
        totalData={{
          name: 'Total Liquidity',
          color: '#ACACAC',
          data: totalLiq,
          numDecimals: 2,
          suffix: '₿',
        }}
        tooltipFormatter={tooltipFormatter}
      />
    </>
  );
}

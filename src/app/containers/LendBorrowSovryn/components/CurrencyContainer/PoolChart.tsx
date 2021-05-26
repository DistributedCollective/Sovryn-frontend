import React from 'react';

import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';
import { LendingPool } from 'utils/models/lending-pool';

interface Props {
  pool: LendingPool;
}

/* Sample data */
const testData: any[] = [
  {
    supply_apr: '4205380178',
    borrow_apr: '745742146',
    timestamp: '2021-05-08T00:00:02.000Z',
  },
  {
    supply_apr: '4205380178',
    borrow_apr: '745742146',
    timestamp: '2021-05-08T06:00:01.000Z',
  },
  {
    supply_apr: '4106673965',
    borrow_apr: '711801811',
    timestamp: '2021-05-08T12:00:01.000Z',
  },
  {
    supply_apr: '4106673965',
    borrow_apr: '711801811',
    timestamp: '2021-05-08T18:00:01.000Z',
  },
  {
    supply_apr: '3720327406',
    borrow_apr: '673757789',
    timestamp: '2021-05-09T00:00:01.000Z',
  },
  {
    supply_apr: '3720327406',
    borrow_apr: '673757789',
    timestamp: '2021-05-09T06:00:03.000Z',
  },
  {
    supply_apr: '3720327406',
    borrow_apr: '673757789',
    timestamp: '2021-05-09T12:00:02.000Z',
  },
  {
    supply_apr: '3720327406',
    borrow_apr: '673757789',
    timestamp: '2021-05-09T18:00:02.000Z',
  },
  {
    supply_apr: '3720327406',
    borrow_apr: '673757789',
    timestamp: '2021-05-10T00:00:01.000Z',
  },
  {
    supply_apr: '3720327406',
    borrow_apr: '673757789',
    timestamp: '2021-05-10T06:00:03.000Z',
  },
  {
    supply_apr: '3721264629',
    borrow_apr: '675145982',
    timestamp: '2021-05-10T12:00:01.000Z',
  },
  {
    supply_apr: '3721264629',
    borrow_apr: '675145982',
    timestamp: '2021-05-10T18:00:01.000Z',
  },
  {
    supply_apr: '3721264629',
    borrow_apr: '675145982',
    timestamp: '2021-05-11T00:00:01.000Z',
  },
  {
    supply_apr: '3721264629',
    borrow_apr: '675145982',
    timestamp: '2021-05-11T06:00:01.000Z',
  },
  {
    supply_apr: '3720300452',
    borrow_apr: '673753270',
    timestamp: '2021-05-11T12:00:01.000Z',
  },
  {
    supply_apr: '3719013724',
    borrow_apr: '672172106',
    timestamp: '2021-05-11T18:00:01.000Z',
  },
  {
    supply_apr: '3719013724',
    borrow_apr: '672172106',
    timestamp: '2021-05-12T00:00:01.000Z',
  },
  {
    supply_apr: '3719013724',
    borrow_apr: '672172106',
    timestamp: '2021-05-12T06:00:02.000Z',
  },
  {
    supply_apr: '3724113749',
    borrow_apr: '679863408',
    timestamp: '2021-05-12T12:00:00.000Z',
  },
  {
    supply_apr: '3720520337',
    borrow_apr: '674621006',
    timestamp: '2021-05-12T18:00:05.000Z',
  },
  {
    supply_apr: '3721304871',
    borrow_apr: '675932431',
    timestamp: '2021-05-13T00:00:03.000Z',
  },
  {
    supply_apr: '3721019131',
    borrow_apr: '675884368',
    timestamp: '2021-05-13T06:00:02.000Z',
  },
  {
    supply_apr: '3721019131',
    borrow_apr: '675884368',
    timestamp: '2021-05-13T12:00:03.000Z',
  },
  {
    supply_apr: '3524504329',
    borrow_apr: '655796008',
    timestamp: '2021-05-13T18:00:01.000Z',
  },
  {
    supply_apr: '3524504329',
    borrow_apr: '655796008',
    timestamp: '2021-05-14T00:00:04.000Z',
  },
  {
    supply_apr: '3524504329',
    borrow_apr: '655796008',
    timestamp: '2021-05-14T06:00:01.000Z',
  },
  {
    supply_apr: '3524504329',
    borrow_apr: '655796008',
    timestamp: '2021-05-14T12:00:02.000Z',
  },
  {
    supply_apr: '3524504329',
    borrow_apr: '655796008',
    timestamp: '2021-05-14T18:00:01.000Z',
  },
];

const testTotal: any[] = [
  {
    total: '136.2222',
    timestamp: '2021-05-08T00:00:02.000Z',
  },
  {
    total: '146.1727',
    timestamp: '2021-05-08T06:00:01.000Z',
  },
  {
    total: '147.1727',
    timestamp: '2021-05-08T12:00:01.000Z',
  },
  {
    total: '143.1727',
    timestamp: '2021-05-08T18:00:01.000Z',
  },
  {
    total: '145.18',
    timestamp: '2021-05-09T00:00:01.000Z',
  },
  {
    total: '146.2222',
    timestamp: '2021-05-09T06:00:03.000Z',
  },
  {
    total: '148.5',
    timestamp: '2021-05-09T12:00:02.000Z',
  },
  {
    total: '149.78',
    timestamp: '2021-05-09T18:00:02.000Z',
  },
  {
    total: '152.555555',
    timestamp: '2021-05-10T00:00:01.000Z',
  },
  {
    total: '151.1727',
    timestamp: '2021-05-10T06:00:03.000Z',
  },
  {
    total: '153.1766',
    timestamp: '2021-05-10T12:00:01.000Z',
  },
  {
    total: '154.44',
    timestamp: '2021-05-10T18:00:01.000Z',
  },
  {
    total: '154.7',
    timestamp: '2021-05-11T00:00:01.000Z',
  },
  {
    total: '155.8888',
    timestamp: '2021-05-11T06:00:01.000Z',
  },
  {
    total: '163.1727',
    timestamp: '2021-05-11T12:00:01.000Z',
  },
  {
    total: '165.1727',
    timestamp: '2021-05-11T18:00:01.000Z',
  },
  {
    total: '166.1727',
    timestamp: '2021-05-12T00:00:01.000Z',
  },
  {
    total: '166.1727',
    timestamp: '2021-05-12T06:00:02.000Z',
  },
  {
    total: '166.1727',
    timestamp: '2021-05-12T12:00:00.000Z',
  },
  {
    total: '168.1727',
    timestamp: '2021-05-12T18:00:05.000Z',
  },
  {
    total: '167.1727',
    timestamp: '2021-05-13T00:00:03.000Z',
  },
  {
    total: '166.1727',
    timestamp: '2021-05-13T06:00:02.000Z',
  },
  {
    total: '167.727',
    timestamp: '2021-05-13T12:00:03.000Z',
  },
  {
    total: '168.1727',
    timestamp: '2021-05-13T18:00:01.000Z',
  },
  {
    total: '167.1727',
    timestamp: '2021-05-14T00:00:04.000Z',
  },
  {
    total: '167.666',
    timestamp: '2021-05-14T06:00:01.000Z',
  },
  {
    total: '169.1727',
    timestamp: '2021-05-14T12:00:02.000Z',
  },
  {
    total: '170.1727',
    timestamp: '2021-05-14T18:00:01.000Z',
  },
];

const btcApr: [number, number][] = testData.map(i => [
  Date.parse(i.timestamp),
  i.supply_apr / 1e8,
]);
const poolApr: [number, number][] = testData.map(i => [
  Date.parse(i.timestamp),
  i.borrow_apr / 1e8,
]);
const totalLiq: [number, number][] = testTotal.map(i => [
  Date.parse(i.timestamp),
  parseFloat(i.total),
]);
/* End sample data */

export function PoolChart(props: Props) {
  return (
    <>
      <ComparisonChart
        primaryData={{
          name: 'rBTC AER',
          color: '#FFAC3E',
          data: btcApr,
          numDecimals: 2,
          suffix: '%',
        }}
        secondaryData={{
          name: `${props.pool.getAsset()} AER`,
          color: getAssetColor(props.pool.getAsset()),
          data: poolApr,
          numDecimals: 2,
          suffix: '%',
        }}
        totalData={{
          name: 'Total Liquidity',
          color: '#ACACAC',
          data: totalLiq,
          numDecimals: 2,
          suffix: '₿',
        }}
      />
    </>
  );
}

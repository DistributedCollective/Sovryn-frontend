/**
 *
 * LoanTokenGraphs
 *
 */
import React, { useEffect, useState, useMemo } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { LendingPool } from 'utils/models/lending-pool';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { databaseRpcNodes } from '../../../utils/classifiers';
import { getLendingContract } from '../../../utils/blockchain/contract-helpers';
import ComparisonChart from '../ComparisonChart';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface DataItem {
  date: Date;
  supply_apr: number;
  supply: number;
}

interface Props {
  lendingPool: LendingPool;
}

export function LoanTokenGraphs(props: Props) {
  const { chainId } = useSelector(selectWalletProvider);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (chainId !== undefined) {
      fetch(databaseRpcNodes[chainId], {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'custom_getLoanTokenHistory',
          params: [
            {
              address: getLendingContract(props.lendingPool.getAsset()).address,
            },
          ],
        }),
      })
        .then(e => e.json().then())
        .then(e => {
          setData(e.slice(-28)); //last 7 days of data in 6hr chunks
        })
        .catch(console.error);
    }
  }, [chainId, props.lendingPool]);

  if (!data.length) {
    return null;
  }

  return (
    <ParentSize>
      {({ width }) => <BarsGraph width={width} data={data} />}
    </ParentSize>
  );
}

interface BarsProps {
  width: number;
  data: DataItem[];
}

function BarsGraph({ width, data }: BarsProps) {
  const { t } = useTranslation();
  const height = 150;

  const supplyApr = useMemo(
    () =>
      (data as any[]).map(i => [Date.parse(i.timestamp), i.supply_apr / 1e8]),
    [data],
  );

  const borrowApr = useMemo(
    () =>
      (data as any[]).map(i => [Date.parse(i.timestamp), i.borrow_apr / 1e8]),
    [data],
  );

  const tooltipFormatter = function (this: any) {
    const d = new Date(this.x);
    return this.points?.reduce(
      function (s, point) {
        return `${s}<br/>${point.series.name}: ${point.y.toFixed(2)}%`;
      },
      `<span class='tw-font-bold'>
        ${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()} ${String(
        d.getUTCHours(),
      ).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC
        </span>`,
    );
  };

  return width < 10 ? null : (
    <div className="tw-relative" style={{ width, height }}>
      <ComparisonChart
        height={height}
        datasetPrimary={{
          type: 'areaspline',
          name: t(translations.lend.currency.lendArp),
          color: '#FFAC3E',
          data: supplyApr,
        }}
        datasetSecondary={{
          type: 'areaspline',
          name: t(translations.lend.currency.borrowArp),
          color: 'white',
          data: borrowApr,
        }}
        tooltipFormatter={tooltipFormatter}
      />
    </div>
  );
}

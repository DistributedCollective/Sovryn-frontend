/**
 *
 * TradingChart
 *
 */
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Chart from 'utils/kaktana-react-lightweight-charts/Chart';
import { Skeleton } from '../PageSkeleton';
import { backendUrl, currentChainId } from 'utils/classifiers';

export enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export enum ChartType {
  LINE = 'line',
  CANDLE = 'candle',
}

export interface ChartContainerProps {
  rate: number;
  symbol: string;
  type: ChartType;
  theme: Theme;
  inSats: boolean;
}

// detailed description of series options https://github.com/kaktana/kaktana-react-lightweight-charts#seriesobject
interface ChartData {
  data: any[];
  options?: any;
  markers?: any;
  priceLines?: any;
  legend?: string;
  linearInterpolation?: number;
}

export function TradingChart(props: ChartContainerProps) {
  // const feedStart = 7257600000; //3 months in ms
  const feedStart = 604800000; //7 days to ms
  const satsPriceFormat = {
    priceFormat: { precision: 8, minMove: 0.00000001 },
  };
  const initData: ChartData[] = [
    {
      data: [],
      legend: '',
      options: props.inSats ? satsPriceFormat : null,
    },
  ];
  const [hasCharts, setHasCharts] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartData[]>(initData.slice());
  const [lastTime, setLastTime] = useState<number>(
    new Date().getTime() - feedStart,
  );

  const resetChart = () => {
    // setHasCharts(false);
    setChartData(initData.slice());
    setLastTime(new Date().getTime() - feedStart);
  };

  const seriesProps = useMemo(() => {
    const data = chartData[0].data.map(({ open, close, high, low, time }) => ({
      open: open || 0,
      close: close || 0,
      high: high || 0,
      low: low || 0,
      time: time || 0,
    }));

    return {
      candlestickSeries:
        props.type === ChartType.CANDLE
          ? [
              {
                data,
                legend: '',
                options: props.inSats ? satsPriceFormat : null,
              },
            ]
          : undefined,
      lineSeries:
        props.type === ChartType.LINE
          ? [
              {
                data,
                legend: '',
                options: props.inSats ? satsPriceFormat : null,
              },
            ]
          : undefined,
    };
  }, [chartData, props.inSats, satsPriceFormat, props.type]);

  useEffect(() => {
    let cancelTokenSource;
    function getData() {
      cancelTokenSource = axios.CancelToken.source();
      axios
        .get(`${backendUrl[currentChainId]}/datafeed/price/${props.symbol}`, {
          cancelToken: cancelTokenSource.token,
          params: {
            type: props.type,
            startTime: lastTime,
          },
        })
        .then(response => {
          if (
            response.data &&
            response.data.series &&
            response.data.series.length > 0
          ) {
            let newSeries: Array<any> = [];
            if (chartData[0].data.length > 0) {
              // remove old datums, starting at the one with same time as first new one that was received
              newSeries = chartData[0].data.slice();
              const firstVal = response.data.series[0];
              const len = newSeries.length - 1;
              let i = -1;
              for (let x = len; x >= 0; x--)
                if (newSeries[x].time === firstVal.time) {
                  i = x;
                  break;
                }
              if (i > -1) newSeries = newSeries.slice(0, i);
            }
            newSeries = newSeries
              .concat(response.data.series)
              .map(({ open, close, high, low, time }) => ({
                open: open || 0,
                close: close || 0,
                high: high || 0,
                low: low || 0,
                time: time || 0,
              }))
              .sort((a, b) => a.time - b.time);
            setChartData([
              {
                data: newSeries,
                legend: '',
                options: props.inSats ? satsPriceFormat : null,
              },
            ]);
            const latest = newSeries[newSeries.length - 1];
            setLastTime(latest.time * 1e3); // datum time is in seconds, lastTime is ms
            setHasCharts(true);
          }
        })
        .catch(error => {
          console.log(error);
          setHasCharts(false);
        });
    }

    getData();

    const interval = setInterval(() => {
      getData();
    }, props.rate * 1e3);
    return () => {
      clearInterval(interval);
      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTime]);

  useEffect(() => {
    resetChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.symbol, props.rate, props.type]);

  return (
    <div
      className="tw-w-full tw-h-full tw-bg-primary tw-relative"
      style={{ minHeight: 500 }}
    >
      {hasCharts ? (
        <>
          <Chart
            options={{
              alignLabels: true,
              timeScale: {
                rightOffset: 3,
                barSpacing: 7,
                shiftVisibleRangeOnNewBar: true,
                rightBarStaysOnScroll: true,
                borderVisible: false,
                visible: true,
                timeVisible: true,
                secondsVisible: true,
              },
              localization: {
                locale: 'en-US',
              },
            }}
            legend={props.symbol}
            darkTheme={props.theme === Theme.DARK}
            autoWidth
            autoHeight
            {...seriesProps}
          />
          <div
            className="tw-w-full tw-absolute tw-text-right tw-pt-1 tw-opacity-50"
            style={{ fontSize: 11 }}
          >
            TradingView Lightweight Charts (с) 2020{' '}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              TradingView, Inc.
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="row tw-h-full tw-flex tw-content-end">
            <div className="col d-flex flex-column justify-content-end align-content-end h-100 w-100">
              <Skeleton height="50%" />
            </div>
            <div className="col d-flex flex-column justify-content-end align-content-end h-100 w-100">
              <Skeleton height="30%" />
            </div>
            <div className="col d-flex flex-column justify-content-end align-content-end h-100 w-100">
              <Skeleton height="80%" />
            </div>
            <div className="col d-flex flex-column justify-content-end align-content-end h-100 w-100">
              <Skeleton height="70%" />
            </div>
            <div className="col d-flex flex-column justify-content-end align-content-end h-100 w-100">
              <Skeleton height="65%" />
            </div>
            <div className="col d-flex flex-column justify-content-end align-content-end h-100 w-100">
              <Skeleton height="30%" />
            </div>
            <div className="col d-flex flex-column justify-content-end align-content-end h-100 w-100">
              <Skeleton height="55%" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

TradingChart.defaultProps = {
  rate: 15,
  type: ChartType.CANDLE,
  theme: Theme.DARK,
};

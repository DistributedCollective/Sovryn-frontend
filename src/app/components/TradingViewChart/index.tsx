/**
 *
 * TradingViewChart
 *
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'kaktana-react-lightweight-charts';
import { Skeleton } from '../PageSkeleton';
import { backendUrl, currentChainId } from 'utils/classifiers';

enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

enum ChartType {
  LINE = 'line',
  CANDLE = 'candle',
}

export interface ChartContainerProps {
  rate: number;
  symbol: string;
  type: ChartType;
  theme: Theme;
}

interface ChartData {
  data: any[];
}

export function TradingViewChart(props: ChartContainerProps) {
  const threeMonths = 7257600000; //3 months in ms
  const initData: ChartData[] = [{ data: [] }];
  const [hasCharts, setHasCharts] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartData[]>(initData.slice());
  const [lastTime, setLastTime] = useState<number>(
    new Date().getTime() - threeMonths,
  );

  const resetChart = () => {
    setHasCharts(false);
    setChartData(initData.slice());
    setLastTime(new Date().getTime() - threeMonths);
  };

  const seriesProps = {
    candlestickSeries: props.type === ChartType.CANDLE ? chartData : undefined,
    lineSeries: props.type === ChartType.LINE ? chartData : undefined,
  };

  useEffect(() => {
    function getData() {
      axios
        .post(backendUrl[currentChainId] + '/price', {
          type: props.type,
          symbol: props.symbol,
          startTime: lastTime,
        })
        .then(response => {
          //console.log(response);
          if (response.data && response.data.series) {
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
            newSeries = newSeries.concat(response.data.series);
            // console.log(newSeries);
            setChartData([{ data: newSeries }]);
            const latest = newSeries[newSeries.length - 1];
            setLastTime(latest.time * 1e3); // datum time is in seconds, lastTime is ms
            console.log(latest.time, latest.close);
            setHasCharts(true);
          }
        })
        .catch(error => {
          console.log(error);
          setHasCharts(false);
        });
    }

    getData();
    const interval = setInterval(() => getData(), props.rate * 1e3);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTime]);

  useEffect(() => {
    resetChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.symbol, props.rate, props.type]);

  return (
    <div className="w-100 h-100 bg-primary" style={{ minHeight: 500 }}>
      {hasCharts ? (
        <Chart
          options={{
            alignLabels: true,
            timeScale: {
              rightOffset: 12,
              barSpacing: 3,
              shiftVisibleRangeOnNewBar: true,
              rightBarStaysOnScroll: true,
              borderVisible: false,
              borderColor: '#fff000',
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
      ) : (
        <>
          <div className="row h-100 d-flex align-content-end">
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

TradingViewChart.defaultProps = {
  rate: 15,
  type: ChartType.CANDLE,
  theme: Theme.DARK,
};

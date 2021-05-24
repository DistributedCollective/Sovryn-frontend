/**
 *
 * TradingChart
 *
 * Implementation of TradingView Charting Library. Please check the following link
 * and make any relevant changes before updating the library version:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import {
  widget,
  IChartingLibraryWidget,
} from 'charting-library/src/charting_library/charting_library.min';

import { Skeleton } from '../PageSkeleton';
import Datafeed from './datafeed';

export enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export interface ChartContainerProps {
  symbol: string;
  theme?: Theme;
}

export function TradingChart(props: ChartContainerProps) {
  const [hasCharts, setHasCharts] = useState<boolean>(false);
  const [chart, setChart] = useState<IChartingLibraryWidget | null>(null);

  useEffect(() => {
    try {
      // full list of widget config options here: https://github.com/tradingview/charting_library/wiki/Widget-Constructor
      const widgetOptions: any = {
        debug: false,
        symbol: props.symbol,
        datafeed: Datafeed,
        interval: '30', //default time interval
        timeframe: '3D', //default range
        container_id: 'tv_chart_container', //id of DOM container
        library_path: '/charting_library/', //relative path of library in /public folder
        locale: 'en',
        enabled_features: [], //full list of features here: https://github.com/tradingview/charting_library/wiki/Featuresets
        disabled_features: [
          'header_symbol_search',
          'header_saveload',
          'header_compare',
        ],
        autosize: true,
        // toolbar_bg: '#a3a3a3',
        theme: props.theme,
        time_frames: [
          { text: '1d', resolution: '10', description: '1d', title: '1d' },
          { text: '3d', resolution: '30', description: '3d', title: '3d' },
          { text: '7d', resolution: '60', description: '7d', title: '7d' },
          { text: '3m', resolution: '120', description: '3m', title: '3m' },
          // { text: '6m', resolution: '240', description: '6m', title: '6m' },
          // { text: '1y', resolution: '1W', description: '1y', title: '1y' },
          { text: '5y', resolution: '1W', description: '5y', title: '5y' },
        ],
      };

      // eslint-disable-next-line
      const myChart = new widget(widgetOptions);
      setChart(myChart);
      myChart.onChartReady(() => {
        setHasCharts(true);
      });

      return () => {
        chart?.remove();
        setHasCharts(false);
        setChart(null);
      };
    } catch (e) {
      setHasCharts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chart)
      chart.chart().setSymbol(props.symbol, () => {
        console.log('changed symbol');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.symbol]);

  return (
    <div
      className={cn(
        'tw-w-full tw-h-full d-flex tw-rounded tw-overflow-hidden',
        hasCharts && 'border',
      )}
      style={{ minWidth: 270, minHeight: 500 }}
    >
      <>
        <div
          id="tv_chart_container"
          className={cn(
            'tv-chart-container tw-flex-grow',
            !hasCharts && 'd-none',
          )}
        />
        <div
          className={cn(
            'tw-w-full tw-h-full align-content-end',
            hasCharts ? 'd-none' : 'd-flex',
          )}
        >
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
    </div>
  );
}

TradingChart.defaultProps = {
  theme: Theme.DARK,
};

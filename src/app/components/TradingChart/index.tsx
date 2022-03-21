/**
 *
 * TradingChart
 *
 * Implementation of TradingView Charting Library (v18.043). Please check the following link
 * and make any relevant changes before updating the library version:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import cn from 'classnames';
import {
  widget,
  IChartingLibraryWidget,
} from '@sovryn/charting-library/src/charting_library/charting_library.min';

import { Skeleton } from '../PageSkeleton';
import Datafeed from './datafeed';
import Storage from './storage';
import { noop } from '../../constants';

export enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export interface ChartContainerProps {
  symbol: string;
  theme?: Theme;
  hasCustomDimensions?: boolean;
}

export function TradingChart(props: ChartContainerProps) {
  const [hasCharts, setHasCharts] = useState<boolean>(false);
  const [chart, setChart] = useState<IChartingLibraryWidget | null>(null);

  useEffect(() => {
    try {
      // full list of widget config options here: https://github.com/tradingview/charting_library/wiki/Widget-Constructor/cf26598509d8bba6dc95c5fe8208caa5e8474827
      const widgetOptions: any = {
        debug: false,
        symbol: props.symbol,
        datafeed: Datafeed,
        save_load_adapter: Storage,
        study_count_limit: 15, //max number of indicators that can be added to charts
        interval: '30', //default time interval
        timeframe: '3D', //default range
        container_id: 'tv_chart_container', //id of DOM container
        library_path: '/charting_library/', //relative path of library in /public folder
        locale: 'en',
        load_last_chart: true, //last chart layout (if present)
        enabled_features: [
          'study_templates', //remove to disable storing of indicators
          'side_toolbar_in_fullscreen_mode',
        ], //full list of features here: https://github.com/tradingview/charting_library/wiki/Featuresets/c2ec34605fa84781048d32b87a2b08ef1466639a
        disabled_features: [
          'header_symbol_search',
          //'header_saveload', //uncomment to disable storing of drawings
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

      const myChart = new widget(widgetOptions);
      setChart(myChart);
      myChart.onChartReady(() => {
        setHasCharts(true);
      });

      return () => {
        myChart.remove();
        setHasCharts(false);
        setChart(null);
      };
    } catch (e) {
      console.error(e);
      setHasCharts(false);
    }

    // run only once after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (chart && hasCharts) {
      chart.chart().setSymbol(props.symbol, noop);
    }
  }, [chart, hasCharts, props.symbol]);

  return (
    <div
      className={cn(
        'tw-w-full tw-h-full tw-flex tw-rounded tw-overflow-hidden',
        hasCharts && 'tw-border',
      )}
      style={
        props.hasCustomDimensions
          ? undefined
          : { minWidth: 270, minHeight: 500 }
      }
    >
      <>
        <div
          id="tv_chart_container"
          className={cn(
            'tv-chart-container tw-flex-grow',
            !hasCharts && 'tw-hidden',
          )}
        />
        <div
          className={cn(
            'tw-w-full tw-h-full tw-content-end tw-gap-4',
            hasCharts ? 'tw-hidden' : 'tw-flex',
          )}
        >
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="50%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="30%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="80%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="70%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="65%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="30%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
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

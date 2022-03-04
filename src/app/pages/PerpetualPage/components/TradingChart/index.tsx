/**
 *
 * TradingChart
 *
 * Implementation of TradingView Charting Library (v18.043). Please check the following link
 * and make any relevant changes before updating the library version:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import {
  widget,
  IChartingLibraryWidget,
  ChartingLibraryWidgetOptions,
} from '@distributedcollective/charting-library/src/charting_library/charting_library.min';

import { Skeleton } from '../../../../components/PageSkeleton';
import datafeed from './datafeed';
import storage from './storage';
import { noop } from '../../../../constants';
import { Nullable } from '../../../../../types';
import { useApolloClient } from '@apollo/client';

export type TradingChartColors = {
  text: string;
  background: string;
  linesX: string;
  linesY: string;
  crosshair: string;
  long: string;
  short: string;
};

export const TRADING_CHART_DEFAULT_COLORS: TradingChartColors = {
  text: '#e8e8e8', // sov-white
  background: '#222222', // gray-2.5
  linesX: '#343434', // gray-4
  linesY: '#343434', // gray-4
  crosshair: '#5c5c5c', // gray-5
  long: '#17C3B2', // trade-long
  short: '#D74E09', // trade-short
};

export type TradingChartProps = {
  symbol: string;
  colors?: TradingChartColors;
  hasCustomDimensions?: boolean;
};

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  colors = TRADING_CHART_DEFAULT_COLORS,
  hasCustomDimensions = false,
}) => {
  const [hasCharts, setHasCharts] = useState(false);
  const [chart, setChart] = useState<Nullable<IChartingLibraryWidget>>(null);
  const client = useApolloClient();

  useEffect(() => {
    try {
      // full list of widget config options here: https://github.com/tradingview/charting_library/wiki/Widget-Constructor/cf26598509d8bba6dc95c5fe8208caa5e8474827
      const widgetOptions: ChartingLibraryWidgetOptions = {
        debug: false,
        symbol,
        datafeed: datafeed(client),
        save_load_adapter: storage,
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
          'volume_force_overlay',
        ],
        overrides: {
          'paneProperties.background': colors.background,
          'paneProperties.vertGridProperties.color': colors.linesY,
          'paneProperties.horzGridProperties.color': colors.linesX,
          'paneProperties.crossHairProperties.color': colors.crosshair,
          'scalesProperties.textColor': colors.text,
          'scalesProperties.backgroundColor': colors.background,
          'symbolWatermarkProperties.transparency': 90,
          'paneProperties.topMargin': 15,
          'paneProperties.bottomMargin': 10,

          'mainSeriesProperties.candleStyle.upColor': colors.long,
          'mainSeriesProperties.candleStyle.downColor': colors.short,
          'mainSeriesProperties.candleStyle.borderUpColor': colors.long,
          'mainSeriesProperties.candleStyle.borderDownColor': colors.short,
          'mainSeriesProperties.candleStyle.wickUpColor': colors.long,
          'mainSeriesProperties.candleStyle.wickDownColor': colors.short,
        },
        custom_css_url: '/charting_library_custom.css',

        autosize: true,
        toolbar_bg: colors.background,
        theme: 'Dark',
        time_frames: [
          { text: '1d', resolution: '15', description: '1d', title: '1d' },
          { text: '3d', resolution: '30', description: '3d', title: '3d' },
          { text: '7d', resolution: '60', description: '7d', title: '7d' },
          { text: '3m', resolution: '120', description: '3m', title: '3m' },
          // { text: '6m', resolution: '240', description: '6m', title: '6m' },
          // { text: '1y', resolution: '1W', description: '1y', title: '1y' },
          { text: '5y', resolution: '1W', description: '5y', title: '5y' },
        ],
        timezone: 'Etc/UTC',
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
  }, [client]);

  useLayoutEffect(() => {
    if (chart && hasCharts) {
      chart.chart().setSymbol(symbol, noop);
    }
  }, [chart, hasCharts, symbol]);

  return (
    <div
      className="tw-w-full tw-h-full tw-flex tw-rounded tw-overflow-hidden"
      style={
        hasCustomDimensions ? undefined : { minWidth: 270, minHeight: 500 }
      }
    >
      <>
        <div
          id="tv_chart_container"
          className={classNames(
            'tv-chart-container tw-flex-grow',
            !hasCharts && 'tw-hidden',
          )}
        />
        {!hasCharts && <TradingChartSkeleton />}
      </>
    </div>
  );
};

const TradingChartSkeleton: React.FC = () => (
  <div className="tw-w-full tw-h-full tw-content-end tw-gap-4 tw-flex">
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
);

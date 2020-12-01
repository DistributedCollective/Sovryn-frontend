/**
 *
 * TradingViewChart
 *
 */
import React, { useEffect, useState } from 'react';
import { TradingPairType } from 'utils/trading-pair-dictionary';
import { Skeleton } from '../PageSkeleton';

enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export interface ChartContainerProps {
  pair: TradingPairType;
  theme: Theme;
}

export function TradingViewChart(props: ChartContainerProps) {
  const [hasCharts, setHasCharts] = useState(true);

  useEffect(() => {
    try {
      // @ts-ignore
      const widget = new TradingView.widget({
        width: 980,
        height: 610,
        symbol: 'BITFINEX:' + props.pair.toLowerCase(),
        interval: '30' as any,
        timezone: 'Etc/UTC',
        // theme: 'Dark',
        locale: 'en',
        toolbar_bg: '#171717',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'trading-view-container',
        autosize: true,
        fullscreen: false,
        studies_overrides: {},
        disabled_features: [
          'left_toolbar',
          'header_compare',
          'header_undo_redo',
          'header_saveload',
          'header_settings',
          'header_screenshot',
          'use_localstorage_for_settings',
          'header_fullscreen_button',
          'go_to_date',
        ],
        // enabled_features: ['study_templates'],
        loading_screen: { backgroundColor: '#171717' },
        overrides: {
          'paneProperties.background': '#171717',
          'paneProperties.vertGridProperties.color': '#363c4e',
          'paneProperties.horzGridProperties.color': '#363c4e',
          'symbolWatermarkProperties.transparency': 200,
          'scalesProperties.textColor': '#AAA',
          'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
          'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
        },
      });
      setHasCharts(true);
      return () => {
        widget.remove();
      };
    } catch (e) {
      setHasCharts(false);
    }
  }, [props.pair]);

  return (
    <div
      id={'trading-view-container'}
      className={'w-100 h-100 bg-primary'}
      style={{ minHeight: 320 }}
    >
      {!hasCharts && (
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
  theme: Theme.DARK,
};

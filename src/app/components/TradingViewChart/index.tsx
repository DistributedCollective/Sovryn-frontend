/**
 *
 * TradingViewChart
 *
 */
import React, { useEffect } from 'react';
import { Asset } from 'types/asset';

enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export interface ChartContainerProps {
  asset: Asset;
  theme: Theme;
}

export function TradingViewChart(props: ChartContainerProps) {
  useEffect(() => {
    // @ts-ignore
    const widget = new TradingView.widget({
      width: 980,
      height: 610,
      symbol: 'BITBAY:BTCUSD' /* props.asset */,
      interval: '30' as any,
      timezone: 'Etc/UTC',
      theme: props.theme,
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: 'trading-view-container',
      autosize: true,
      fullscreen: false,
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
      loading_screen:
        props.theme === Theme.DARK
          ? { backgroundColor: 'rgb(0, 0, 0)' }
          : { backgroundColor: 'rgb(256, 256, 256)' },
      overrides: {
        'paneProperties.background': '#131722',
        'paneProperties.vertGridProperties.color': '#363c4e',
        'paneProperties.horzGridProperties.color': '#363c4e',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#AAA',
        'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
        'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
      },
    });

    return () => {
      widget.remove();
    };
  }, [props.theme]);

  return (
    <div
      id={'trading-view-container'}
      className={'w-100 h-100 background-secondary'}
    />
  );
}

TradingViewChart.defaultProps = {
  theme: Theme.DARK,
};

/**
 *
 * TradingViewChart
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import {
  widget,
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
} from 'libs/charting_library/charting_library.min';

enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export interface ChartContainerProps {
  asset: Asset;
  theme: Theme;
}

export interface ChartContainerState {}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

export class TradingViewChart extends React.PureComponent<
  Partial<ChartContainerProps>,
  ChartContainerState
> {
  static defaultProps = {
    theme: Theme.DARK,
  };
  private tvWidget: IChartingLibraryWidget | null = null;

  public componentDidMount(): void {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: `WBTC_DAI` as string,
      container_id: 'trading-view-container',
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        'https://api.kyber.network/chart',
      ),
      interval: '30' as any,
      library_path: '/charting_library/',
      locale: getLanguageFromURL() || 'en',
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
      enabled_features: ['study_templates'],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      // Dark theme
      //theme: 'Dark',
      loading_screen:
        this.props.theme === Theme.DARK
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
      //custom_css_url: '/charting_library/custom_css.css',
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      // tvWidget.headerReady().then(() => {
      //   const button = tvWidget.createButton();
      //   button.setAttribute('title', 'Click to show a notification popup');
      //   button.classList.add('apply-common-tooltip');
      //   button.addEventListener('click', () =>
      //     tvWidget.showNoticeDialog({
      //       title: 'Notification',
      //       body: 'TradingView Charting Library API works correctly',
      //       callback: () => {
      //         console.log('Noticed!');
      //       },
      //     }),
      //   );
      //   button.innerHTML = 'Check API';
      // });
    });
  }

  public componentWillUnmount(): void {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  public render(): JSX.Element {
    return (
      <div
        id={'trading-view-container'}
        className={'w-100 h-100 background-secondary'}
      />
    );
  }
}

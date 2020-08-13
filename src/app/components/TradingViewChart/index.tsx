/**
 *
 * TradingViewChart
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import { Asset } from '../../../types/asset';
import { Helmet } from 'react-helmet-async';

enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

interface Props {
  asset: Asset;
  theme: Theme;
}

// todo implement charting_library package instead of external widget.
export function TradingViewChart(props: Props) {
  const tradingView = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(true);

  useEffect(() => {
    if (scriptLoaded) {
      const timer = setInterval(() => {
        setScriptLoaded(window.TradingView === undefined);
      }, 50);
      return () => {
        clearInterval(timer);
      };
    }
  }, [scriptLoaded]);

  useEffect(() => {
    if (window.TradingView) {
      // @ts-ignore*
      tradingView.current = new TradingView.widget({
        symbol: 'COINBASE:' + props.asset + 'USD',
        interval: '30',
        timezone: 'Etc/UTC',
        theme: props.theme,
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        container_id: 'tradingview_83599',
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
          'https://api.kyber.network/chart',
        ),
        // libraryPath: '/charting_library/',
        fullscreen: false,
        autosize: true,
        save_image: false,
        preset: undefined,
        loading_screen:
          props.theme === Theme.DARK ? { backgroundColor: 'rgb(0, 0, 0)' } : {},
        overrides:
          props.theme === Theme.DARK
            ? { 'paneProperties.background': 'rgb(0, 0, 0)' }
            : {},
        // custom_css_url: "/charting_library/custom_css.css"
      } as any);
    }

    return () => {
      if (tradingView.current) {
        // @ts-ignore
        tradingView.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, props.theme]);

  useEffect(() => {
    // todo: update chart with new asset without rerendering component.
  }, [props.asset]);

  return (
    <>
      <Helmet>
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js" />
      </Helmet>
      {scriptLoaded}
      <div
        className={`w-100 h-100 shadow ${scriptLoaded ? 'bp3-skeleton' : ''}`}
        id="tradingview_83599"
      />
    </>
  );
}

TradingViewChart.defaultProps = {
  theme: Theme.LIGHT,
};

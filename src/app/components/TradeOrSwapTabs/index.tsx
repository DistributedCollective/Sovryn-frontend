/**
 *
 * TradeOrSwapTabs
 *
 */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from 'react-bootstrap';
import { translations } from 'locales/i18n';
import { MarginTradeForm } from '../../containers/MarginTradeForm/Loadable';
import { SwapTradeForm } from '../../containers/SwapTradeForm/Loadable';
import { Icon } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectTradingPage } from '../../containers/TradingPage/selectors';
import { actions } from 'app/containers/TradingPage/slice';

const s = translations.tradeOrSwapTabs;

interface Props {}

enum TabType {
  TRADE,
  SWAP,
  CHARTS,
}

export function TradeOrSwapTabs(props: Props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const trading = useSelector(selectTradingPage);

  const [key, setKey] = useState<TabType>(TabType.TRADE);

  const handleSelection = useCallback(
    e => {
      if (e !== String(TabType.CHARTS)) {
        setKey(e);
      } else {
        setKey(key);
        dispatch(actions.toggleMobileStats());
      }
    },
    [dispatch, key],
  );

  return (
    <div className="sovryn-tabs">
      <Tabs
        activeKey={key}
        onSelect={handleSelection}
        defaultActiveKey={TabType.TRADE}
        id="trade-n-swap-tabs"
      >
        <Tab
          eventKey={(TabType.TRADE as unknown) as string}
          title={t(s.tabs.trade)}
        >
          <MarginTradeForm />
        </Tab>
        <Tab
          eventKey={(TabType.SWAP as unknown) as string}
          title={t(s.tabs.swap)}
        >
          <SwapTradeForm />
        </Tab>
        <Tab
          title={<Icon icon="chart" />}
          tabClassName={[
            'custom-stats-tab d-lg-none',
            trading.isMobileStatsOpen ? 'charts-active' : '',
          ].join(' ')}
          eventKey={(TabType.CHARTS as unknown) as string}
        >
          {trading.isMobileStatsOpen}
        </Tab>
      </Tabs>
    </div>
  );
}

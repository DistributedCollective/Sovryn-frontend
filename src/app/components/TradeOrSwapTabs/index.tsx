/**
 *
 * TradeOrSwapTabs
 *
 */
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from 'react-bootstrap';
import { translations } from 'locales/i18n';
import { MarginTradeForm } from '../../containers/MarginTradeForm/Loadable';
import { SwapTradeForm } from '../../containers/SwapTradeForm/Loadable';
import { Icon } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectTradingPage } from '../../containers/TradingPage/selectors';
import { actions } from 'app/containers/TradingPage/slice';
import { TabType } from '../../containers/TradingPage/types';

const s = translations.tradeOrSwapTabs;

interface Props {}

export function TradeOrSwapTabs(props: Props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const trading = useSelector(selectTradingPage);

  const handleSelection = useCallback(
    e => {
      if (e !== 'charts') {
        dispatch(actions.changeTab(e));
      } else {
        dispatch(actions.toggleMobileStats());
      }
    },
    [dispatch],
  );

  return (
    <div className="sovryn-tabs">
      <Tabs
        activeKey={trading.tab}
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
          eventKey={'charts'}
        >
          {trading.isMobileStatsOpen}
        </Tab>
      </Tabs>
    </div>
  );
}

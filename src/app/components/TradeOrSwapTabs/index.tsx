/**
 *
 * TradeOrSwapTabs
 *
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from 'react-bootstrap';
import { translations } from 'locales/i18n';
import { MarginTradeForm } from '../../containers/MarginTradeForm/Loadable';
import { SwapTradeForm } from '../../containers/SwapTradeForm/Loadable';

const s = translations.tradeOrSwapTabs;

interface Props {}

enum TabType {
  TRADE,
  SWAP,
}

export function TradeOrSwapTabs(props: Props) {
  const { t } = useTranslation();

  const [key, setKey] = useState<TabType>(TabType.TRADE);

  return (
    <div className="sovryn-tabs">
      <Tabs
        activeKey={key}
        onSelect={k => setKey((k as unknown) as TabType)}
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
      </Tabs>
    </div>
  );
}

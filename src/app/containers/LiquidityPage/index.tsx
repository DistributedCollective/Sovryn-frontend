/**
 *
 * LiquidityPage
 *
 */

import React from 'react';
import { Tab, Tabs } from '@blueprintjs/core';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { LiquidityAddContainer } from '../LiquidityAddContainer';
import { LiquidityMining } from '../LiquidityMining';
import { Explainer } from '../LiquidityMining/components/Explainer';
import { LiquidityRemoveContainer } from '../LiquidityRemoveContainer';

enum TabType {
  ADD = 'trade-n-swap-tabs-add',
  REMOVE = 'trade-n-swap-tabs-remove',
  EXPLAINER = 'trade-n-swap-tabs-explainer',
}

interface Props {}

export function LiquidityPage(props: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.liquidity.title)}</title>
        <meta name="description" content={t(translations.liquidity.meta)} />
      </Helmet>
      <Header />
      <div className="tw-container tw-mx-auto tw-px-4 tw-mt-12">
        <div className="tw-grid tw-gap-8 tw-grid-cols-12">
          <div className="tw-col-span-12 lg:tw-col-span-6 lg:tw-order-0 lg:tw-pr-12">
            <div className="sovryn-tabs">
              <Tabs defaultSelectedTabId={TabType.ADD} id="trade-n-swap-tabs">
                <Tab
                  id={TabType.ADD}
                  title={t(translations.lend.container.supply)}
                  panel={<LiquidityAddContainer />}
                />
                <Tab
                  id={TabType.REMOVE}
                  title={t(translations.lend.container.rightBtn)}
                  panel={<LiquidityRemoveContainer />}
                />
              </Tabs>
            </div>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-6 lg:tw-order-0 lg:tw-pl-3 tw-mt-5 md:tw-mt-0">
            <div className="sovryn-tabs">
              <Tabs defaultSelectedTabId={TabType.ADD} id="trade-n-swap-tabs">
                <Tab
                  id={TabType.EXPLAINER}
                  title={t(translations.marketingPage.explain.title)}
                  panel={<Explainer />}
                />
              </Tabs>
            </div>
          </div>
        </div>
        <div className="tw-grid tw-gap-8 tw-grid-cols-12 tw-mt-8">
          <div className="tw-col-span-12">
            <div className="tw-container tw-p-3 sovryn-border">
              <LiquidityMining />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

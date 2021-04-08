/**
 *
 * LiquidityPage
 *
 */

import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
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
  ADD,
  REMOVE,
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
              <Tabs defaultActiveKey={TabType.ADD} id="trade-n-swap-tabs">
                <Tab
                  eventKey={(TabType.ADD as unknown) as string}
                  title={t(translations.lend.container.supply)}
                >
                  <LiquidityAddContainer />
                </Tab>
                <Tab
                  eventKey={(TabType.REMOVE as unknown) as string}
                  title={t(translations.lend.container.rightBtn)}
                >
                  <LiquidityRemoveContainer />
                </Tab>
              </Tabs>
            </div>
          </div>
          <div className="col-12 col-lg-6 order-lg-0 pl-lg-3 mt-5 mt-md-0">
            <div className="sovryn-tabs">
              <Tabs defaultActiveKey={TabType.ADD} id="trade-n-swap-tabs">
                <Tab
                  eventKey={(TabType.ADD as unknown) as string}
                  title={t(translations.marketingPage.explain.title)}
                >
                  <Explainer />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12">
            <div className="container p-3 sovryn-border">
              <LiquidityMining />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

/**
 *
 * LiquidityPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LiquidityAddContainer } from '../LiquidityAddContainer';
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
        </div>
      </div>
      <Footer />
    </>
  );
}

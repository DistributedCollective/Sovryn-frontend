/**
 *
 * LiquidityPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tab, Tabs } from 'react-bootstrap';
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
  return (
    <>
      <Helmet>
        <title>Liquidity</title>
        <meta name="description" content="Add liquidity" />
      </Helmet>
      <Header />
      {/* <HintDialog /> */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-12 col-lg-6 order-lg-0 pr-lg-5">
            <div className="sovryn-tabs">
              <Tabs defaultActiveKey={TabType.ADD} id="trade-n-swap-tabs">
                <Tab
                  eventKey={(TabType.ADD as unknown) as string}
                  title={'Supply'}
                >
                  <LiquidityAddContainer />
                </Tab>
                <Tab
                  eventKey={(TabType.REMOVE as unknown) as string}
                  title={'Withdraw'}
                >
                  <LiquidityRemoveContainer />
                </Tab>
                {/*<Tab*/}
                {/*  eventKey={(TabType.CONVERT as unknown) as string}*/}
                {/*  title={'Convert'}*/}
                {/*>*/}
                {/*  <WrappedBitcoinConverter />*/}
                {/*</Tab>*/}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

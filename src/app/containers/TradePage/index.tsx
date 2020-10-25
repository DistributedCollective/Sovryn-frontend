/**
 *
 * TradePage
 *
 */

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HintDialog } from '../../components/HintDialog';
import { Announcement } from '../../components/Announcement';
import { TradingViewChart } from '../../components/TradingViewChart';
import { InfoBox } from '../../components/InfoBox';
import { TradingToken } from '../TradingToken';
import { TradingActivity } from '../TradingActivity';
import { Asset } from '../../../types/asset';

export function TradePage() {
  return (
    <>
      <Header />
      <main>
        <HintDialog />
        <div className="container">
          <Announcement />
        </div>
        <div className="container">
          <div className="row">
            <div
              className="col-md-12 col-lg-5 mb-2 mr-0 d-flex flex-column justify-content-between"
              style={{ minHeight: 400 }}
            >
              <TradingToken marketToken={Asset.BTC} />
            </div>
            <div
              className="col-md-12 col-lg-7 order-first order-lg-last mb-2"
              style={{ minHeight: 300 }}
            >
              <TradingViewChart asset={Asset.BTC} />
            </div>
          </div>
          <TradingActivity />
        </div>
      </main>
      <Footer />
    </>
  );
}

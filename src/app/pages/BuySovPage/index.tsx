/**
 *
 * TradingPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import PageHeader from '../../components/PageHeader';
import { ArrowStep } from './components/ArrowStep';
import { EngageWalletStep } from './components/EngageWallet';
import { TopUpWallet } from './components/TopUpWallet';
import { BuyForm } from './components/BuyForm';
import { Welcome } from './components/Welcome';
import { InfoBar } from './components/InfoBar';

export function BuySovPage() {
  return (
    <>
      <Helmet>
        {/*<title>{t(s.meta.title)}</title>*/}
        {/*<meta name="description" content={t(s.meta.description)} />*/}
      </Helmet>
      <Header />
      <div className="container mt-5 font-family-montserrat">
        <PageHeader content="Buy SOV exclusively on Sovryn!" />

        <InfoBar />

        <div className="w-100 d-flex flex-row justify-content-center align-items-start">
          <div>
            <div className="w-100 d-flex flex-row justify-content-center align-items-start">
              <EngageWalletStep />
              <ArrowStep />
              <TopUpWallet />
            </div>
            <Welcome />
          </div>
          <ArrowStep />
          <BuyForm />
        </div>

        <div style={{ marginTop: 160 }}>tutorials.</div>
      </div>
      <Footer />
    </>
  );
}

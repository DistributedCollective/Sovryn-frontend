/**
 *
 * TradingPage
 *
 */

import React, { useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import PageHeader from '../../components/PageHeader';
import { ArrowStep } from './components/ArrowStep';
import { EngageWalletStep } from './components/EngageWallet';
import { TopUpWallet } from './components/TopUpWallet';
import { BuyForm } from './components/BuyForm';
import { Welcome } from './components/Welcome';
import { InfoBar } from './components/InfoBar';

import { Banner } from './components/Banner';
import { Promotions } from './components/Promotions';
import { Features } from './components/Features';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export function BuySovPage() {
  const { t } = useTranslation();
  const ref1 = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = useCallback(() => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [ref]);

  const bannerClick = useCallback(() => {
    if (ref1.current) {
      window.scrollTo({
        top: ref1.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [ref1]);

  return (
    <>
      <Helmet>
        <title>{t(translations.buySovPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.buySovPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container mt-5 font-family-montserrat">
        <Banner onClick={bannerClick} />

        <div ref={ref1} />
        <PageHeader content={t(translations.buySovPage.title)} />

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

        <div className="w-100 text-center">
          <Learn onClick={scrollTo}>{t(translations.buySovPage.earn)}</Learn>
        </div>

        <Promotions />

        <div ref={ref} />
        <Features />
      </div>
      <Footer />
    </>
  );
}

const Learn = styled.button`
  border: 1px solid #e9eae9;
  color: #e9eae9;
  padding: 11px 37px;
  margin: 70px auto 115px;
  display: inline-block;
  border-radius: 10px;
  background: transparent;
  text-transform: none;
`;

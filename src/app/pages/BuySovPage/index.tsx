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

        <div className="w-100 d-xl-flex flex-row justify-content-center">
          <div>
            <div className="w-100 d-md-flex flex-row justify-content-center align-items-center">
              <EngageWalletStep />
              <RotatedMob className="d-flex mx-1 justify-content-center align-items-center flex-grow-0 flex-shrink-0">
                <ArrowStep />
              </RotatedMob>
              <TopUpWallet />
              <div className="d-xl-flex d-none mx-1 justify-content-center align-items-center flex-grow-0 flex-shrink-0">
                <ArrowStep />
              </div>
            </div>
            <Welcome />
          </div>
          <div className="d-xl-flex flex-row justify-content-start align-items-center">
            <Rotated className="d-xl-none d-flex mx-1 justify-content-center align-items-center flex-grow-0 flex-shrink-0">
              <ArrowStep />
            </Rotated>
            <BuyForm />
          </div>
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
  padding: 7px 41px;
  margin: 90px auto 115px;
  display: inline-block;
  border-radius: 10px;
  background: transparent;
  text-transform: none;
`;

const Rotated = styled.div`
  img {
    transform: rotate(90deg);
  }
`;
const RotatedMob = styled.div`
  @media (max-width: 768px) {
    img {
      transform: rotate(90deg);
    }
  }
`;

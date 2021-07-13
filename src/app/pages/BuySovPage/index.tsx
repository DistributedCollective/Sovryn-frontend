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
import { ArrowStep } from './components/ArrowStep';
import { EngageWalletStep } from './components/EngageWallet';
import { TopUpWallet } from './components/TopUpWallet';
import { BuyForm } from './components/BuyForm';
import { Welcome } from './components/Welcome';
import { InfoBar } from './components/InfoBar';

import { Features } from './components/Features';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export function BuySovPage() {
  const { t } = useTranslation();

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
      <div className="container pt-5 font-family-montserrat">
        <InfoBar />

        <Onboarding className="w-100 max-w-100 mx-auto d-xl-flex flex-row justify-content-center">
          <div className="flex-shrink-0 flex-grow-1">
            <div className="w-100 d-flex flex-column md:tw-flex-row justify-content-center align-items-center">
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
          <div className="d-xl-flex flex-row justify-content-start align-items-center tw-flex-initial">
            <Rotated className="d-xl-none d-flex mx-1 justify-content-center align-items-center flex-grow-0 flex-shrink-0">
              <ArrowStep />
            </Rotated>
            <BuyForm />
          </div>
        </Onboarding>

        <Features />
      </div>
      <Footer />
    </>
  );
}

const Onboarding = styled.div`
  max-width: 1200px;
  margin-bottom: 170px;
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

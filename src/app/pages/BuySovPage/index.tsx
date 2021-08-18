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
      <div className="tw-container tw-mt-5 tw-font-body">
        <Banner onClick={bannerClick} />

        <div ref={ref1} />
        <PageHeader content={t(translations.buySovPage.title)} />

        <InfoBar />

        <div className="tw-w-full xl:tw-flex tw-flex-row tw-justify-center">
          <div>
            <div className="tw-w-full md:tw-flex tw-flex-row tw-justify-center tw-items-center">
              <EngageWalletStep />
              <RotatedMob className="tw-flex tw-mx-1 tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0">
                <ArrowStep />
              </RotatedMob>
              <TopUpWallet />
              <div className="xl:tw-flex tw-hidden tw-mx-1 tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0">
                <ArrowStep />
              </div>
            </div>
            <Welcome />
          </div>
          <div className="xl:tw-flex tw-flex-row tw-justify-start tw-items-center">
            <Rotated className="xl:tw-hidden tw-flex tw-mx-1 tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0">
              <ArrowStep />
            </Rotated>
            <BuyForm />
          </div>
        </div>

        <div className="tw-w-full tw-text-center">
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
  border: 1px solid #e8e8e8;
  color: #e8e8e8;
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

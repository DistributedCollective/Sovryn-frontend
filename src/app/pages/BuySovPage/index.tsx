import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';

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
      <div className="tw-container tw-pt-5 tw-font-body">
        <InfoBar />

        <Onboarding className="tw-w-full tw-max-w-full tw-flex-row xl:tw-flex tw-justify-center">
          <div className="tw-flex-shrink-0 tw-flex-grow-1">
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
          <div className="xl:tw-flex tw-flex-row tw-justify-start tw-items-center tw-flex-initial">
            <Rotated className="xl:tw-hidden tw-flex tw-mx-1 tw-justify-center tw-items-center tw-flex-grow-0 tw-flex-shrink-0">
              <ArrowStep />
            </Rotated>
            <BuyForm />
          </div>
        </Onboarding>

        <Features />
      </div>
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ClaimForm } from './components/ClaimForm';
import { useAccount } from 'app/hooks/useAccount';
import { VestForm } from './components/VestForm';

export const OriginsClaimPage: React.FC = () => {
  const { t } = useTranslation();
  const userAddress = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.rewardPage.meta.description)}
        />
      </Helmet>

      <Header />

      <div className="tw-container tw-my-12 tw-mx-auto tw-px-6">
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center lg:tw-justify-center lg:tw-space-x-8 tw-space-y-8 lg:tw-space-y-0">
          <VestForm address={userAddress} />
          <ClaimForm address={userAddress} />
        </div>
      </div>
      <Footer />
    </>
  );
};

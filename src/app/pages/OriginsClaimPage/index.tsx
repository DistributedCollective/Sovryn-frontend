import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Helmet } from 'react-helmet-async';
import { ClaimForm } from './components/ClaimForm';
import { useAccount } from 'app/hooks/useAccount';

export const OriginsClaimPage: React.FC = () => {
  const { t } = useTranslation();
  const userAddress = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.originsClaim.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.originsClaim.meta.description)}
        />
      </Helmet>

      <div className="tw-container tw-my-12 tw-mx-auto tw-px-6">
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col">
          <ClaimForm address={userAddress} />
        </div>
      </div>
    </>
  );
};

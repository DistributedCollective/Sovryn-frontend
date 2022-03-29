import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import getStartedBanner from 'assets/images/banner/get_started.png';
import { Button, ButtonSize } from 'app/components/Button';

export const GetStartedBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-end tw-relative tw-w-full tw-h-full">
      <img
        src={getStartedBanner}
        alt={t(translations.landingPage.banner.getStarted)}
      />
      <Button
        className="tw-relative sm:tw-absolute tw-self-center sm:tw-self-auto tw-mb-6 tw-ml-0 tw-mt-2 sm:tw-mt-0 sm:tw-ml-8"
        text={t(translations.landingPage.banner.getStarted)}
        href="/buy-sov"
        size={ButtonSize.lg}
      />
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
//import { UpcomingSalesCardSection } from './components/UpcomingSalesCardSection/index';
import { PreviousSalesCardSection } from './components/PreviousSalesCardSection/index';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="tw-mt-8">
      {/* undo once we have more upcoming sales */}
      {/* <div className="tw-text-center tw-text-3xl tw-font-semibold">
        {t(translations.originsLaunchpad.upcomingSales.title)}
      </div>
      <div className="tw-mt-16">
        <UpcomingSalesCardSection />
        <EmailSubscribeSection />
      </div> */}

      <div className="tw-mt-8 tw-mb-60">
        <div className="tw-text-center tw-text-3xl tw-font-semibold">
          {t(translations.originsLaunchpad.previousSales.title)}
        </div>
        <PreviousSalesCardSection />
      </div>
    </div>
  );
};

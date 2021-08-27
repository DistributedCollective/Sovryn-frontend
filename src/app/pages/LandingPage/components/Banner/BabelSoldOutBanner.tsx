import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import babelfishBanner from 'assets/images/banner/babelFish-sale-sold-out.png';

export const BabelSoldOutBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="tw-relative tw-w-full tw-h-full">
      <img
        src={babelfishBanner}
        className="tw-w-full tw-h-full tw-object-scale tw-object-left tw-rounded-2xl tw-border tw-border-solid tw-border-turquoise2 tw-min-h-240"
        alt={t(translations.landingPage.banner.originsFish)}
      />
    </div>
  );
};

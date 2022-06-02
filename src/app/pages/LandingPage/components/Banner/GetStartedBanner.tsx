import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import getStartedBanner from 'assets/images/banner/banner_zero.svg';
import getStartedBannerMobile from 'assets/images/banner/banner_zero_mobile.svg';
import { Button, ButtonSize, ButtonStyle } from 'app/components/Button';
import { Picture } from 'app/components/Picture';
import { Breakpoint } from 'types';

export const GetStartedBanner: React.FC = () => {
  const { t } = useTranslation();
  const pictureSrcSet = [
    {
      src: getStartedBannerMobile,
      media: Breakpoint.sm,
    },
  ];
  return (
    <div className="tw-flex tw-flex-col tw-justify-center sm:tw-flex-row tw-items-end tw-relative tw-w-full tw-h-full">
      <Picture src={getStartedBanner} srcSet={pictureSrcSet} />
      <Button
        className="tw-absolute tw-self-center tw-min-h-8 sm:tw-min-h-12 sm:tw-self-auto tw-bottom-3 sm:tw-bottom-6 tw-text-sm sm:tw-text-xl tw-border-2 tw-py-1 sm:tw-py-3"
        text={t(translations.landingPage.banner.getStarted)}
        href="/zero"
        size={ButtonSize.lg}
        style={ButtonStyle.transparent}
        dataActionId="landing-getstarted-button"
      />
    </div>
  );
};

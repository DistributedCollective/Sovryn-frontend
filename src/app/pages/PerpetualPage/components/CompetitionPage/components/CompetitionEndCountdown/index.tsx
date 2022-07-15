import { translations } from 'locales/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';

type CompetitionEndCountdownProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const CompetitionEndCountdown: React.FC<CompetitionEndCountdownProps> = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  const { t } = useTranslation();
  return (
    <div className="tw-flex tw-items-center">
      <span className="tw-font-bold tw-mr-2">
        {t(translations.competitionPage.countdown.label)}
      </span>
      {days} {t(translations.competitionPage.countdown.days)}
      <Divider />
      {hours} {t(translations.competitionPage.countdown.hours)}
      <Divider />
      {minutes} {t(translations.competitionPage.countdown.minutes)}
      <Divider />
      {seconds} {t(translations.competitionPage.countdown.seconds)}
    </div>
  );
};

const Divider = () => (
  <span className="tw-box-border tw-inline-block tw-h-4 tw-border-r tw-border-solid tw-border-gray-7 tw-mx-2" />
);

import { translations } from 'locales/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';

type CompetitionEndCountdownProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

export const CompetitionEndCountdown: React.FC<CompetitionEndCountdownProps> = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <span className="tw-font-bold">
        {t(translations.competitionPage.countdown.label)}{' '}
      </span>
      {days} {t(translations.competitionPage.countdown.days)} {hours}{' '}
      {t(translations.competitionPage.countdown.hours)} {minutes}{' '}
      {t(translations.competitionPage.countdown.minutes)} {seconds}{' '}
      {t(translations.competitionPage.countdown.seconds)}
    </div>
  );
};

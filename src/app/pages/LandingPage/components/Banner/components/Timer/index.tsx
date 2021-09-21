import React from 'react';
import { useTimer } from 'react-timer-hook';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Digit } from './Digit';

interface ITimerProps {
  expiryTimestamp: number;
  onExpire: () => void;
}

export const Timer: React.FC<ITimerProps> = ({ expiryTimestamp, onExpire }) => {
  const { t } = useTranslation();
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire,
  });

  return (
    <div className="tw-bg-gray-1 tw-px-5 tw-pt-3 tw-pb-7 tw-rounded-xl tw-text-3xl tw-font-semibold tw-flex tw-items-center">
      <Digit
        value={days}
        title={t(translations.landingPage.banner.timer.days)}
      />
      :
      <Digit
        value={hours}
        title={t(translations.landingPage.banner.timer.hours)}
      />
      :
      <Digit
        value={minutes}
        title={t(translations.landingPage.banner.timer.mins)}
      />
      :
      <Digit
        value={seconds}
        title={t(translations.landingPage.banner.timer.secs)}
      />
    </div>
  );
};

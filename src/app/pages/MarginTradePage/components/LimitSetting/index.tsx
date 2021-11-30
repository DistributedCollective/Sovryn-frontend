import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styles from './dialog.module.scss';
import { Duration } from 'app/pages/SpotTradingPage/components/LimitOrderSetting/Duration';

interface ILimitSettingProps {
  onClose: () => void;
  duration: number;
  handleDuration: (value: number) => void;
}

export function LimitSetting({
  handleDuration,
  duration,
  onClose,
}: ILimitSettingProps) {
  const { t } = useTranslation();

  return (
    <div className="tw-rounded-3xl tw-absolute tw-inset-0 tw-bg-black tw-p-4">
      <button className={styles.buttonClose} onClick={onClose} />
      <div className="tw-mb-6 tw-text-center">
        {t(translations.marginTradeForm.fields.limitSettings)}
      </div>
      <div className="tw-text-sm tw-font-light tw-tracking-normal">
        <Duration onChange={handleDuration} value={duration} />
      </div>
    </div>
  );
}

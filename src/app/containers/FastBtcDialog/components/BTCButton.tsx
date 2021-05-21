import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ActionButton } from 'form/ActionButton';

interface Props {
  loading: boolean;
  ready: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function BTCButton({ loading, ready, disabled, onClick }: Props) {
  const { t } = useTranslation();
  return (
    <div className="tw-w-72">
      <ActionButton
        text={t(translations.fastBtcDialog.buttonBTC)}
        onClick={onClick}
        className="tw-flex tw-items-center tw-justify-center tw-w-full tw-h-12 tw-rounded-lg"
        textClassName="tw-inline-block tw-text-lg"
        disabled={loading || !ready || disabled}
      />
    </div>
  );
}

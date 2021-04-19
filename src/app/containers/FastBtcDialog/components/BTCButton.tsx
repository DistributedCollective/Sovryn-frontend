import React from 'react';
import { Button } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  loading: boolean;
  ready: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function BTCButton({ loading, ready, disabled, onClick }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="justify-content-center items-center d-flex flex-row w-100">
        <Button
          minimal
          className="text-gold button-width button-round font-size-lg mx-auto"
          text={t(translations.fastBtcDialog.buttonBTC)}
          loading={loading}
          disabled={loading || !ready || disabled}
          onClick={onClick}
        />
      </div>
    </>
  );
}

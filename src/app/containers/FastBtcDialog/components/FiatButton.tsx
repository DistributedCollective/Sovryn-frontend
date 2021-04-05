import React from 'react';
import { Button } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  loading: boolean;
  ready: boolean;
  onClick: () => void;
}

export function FiatButton({ loading, ready, onClick }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="justify-content-center items-center d-flex flex-row">
        <Button
          minimal
          className="text-gold button-width button-round font-size-lg mx-auto"
          text={t(translations.fastBtcDialog.buttonFiat)}
          loading={loading}
          disabled={loading || !ready}
          onClick={onClick}
        />
      </div>
    </>
  );
}

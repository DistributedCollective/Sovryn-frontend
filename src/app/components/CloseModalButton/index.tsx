import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function CloseModalButton() {
  const { t } = useTranslation();

  return (
    <div
      className="tw-absolute"
      style={{ top: '0', right: '0', fontSize: '12px', cursor: 'pointer' }}
    >
      <u>{t(translations.modal.close)}</u> X
    </div>
  );
}

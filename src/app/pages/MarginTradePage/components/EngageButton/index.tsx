import React from 'react';
import cn from 'classnames';
import { useWalletContext } from '@sovryn/react-wallet';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function EngageButton() {
  const { t } = useTranslation();
  const { connect, loading } = useWalletContext();
  return (
    <button
      type="button"
      className={cn('tw-btn-engage', { loading: loading })}
      onClick={() => connect()}
      disabled={loading}
    >
      {t(translations.wallet.connect_btn)}
    </button>
  );
}

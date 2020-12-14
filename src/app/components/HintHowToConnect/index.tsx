import React from 'react';
import { Icon } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Trans } from 'react-i18next';
import { ConnectWalletButton } from '../../containers/ConnectWalletButton';

export function HintHowToConnect() {
  const { t } = useTranslation();
  return (
    <div>
      <p>
        <Icon icon="info-sign" /> {t(translations.hintHowToConnect.hintOne)}
      </p>{' '}
      <p>
        {' '}
        <Trans
          i18nKey={translations.hintHowToConnect.hintTwo}
          components={[
            <a
              href="https://sovryn.app/blog/metamask-wallet-for-sovryn.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metamask
            </a>,
            <a
              href="https://sovryn.app/blog/using-nifty-wallet-for-sovryn.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nifty
            </a>,
          ]}
        />
      </p>
      <ConnectWalletButton />
    </div>
  );
}

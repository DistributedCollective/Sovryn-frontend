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
              href="https://medium.com/sovryn/setting-up-metamask-for-sovryn-on-mainnet-cbf798ca0c9a"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metamask
            </a>,
            <a
              href="https://medium.com/sovryn/using-nifty-wallet-for-sovryn-bf95f214b41"
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

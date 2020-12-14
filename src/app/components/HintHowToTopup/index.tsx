import React from 'react';
import { Icon } from '@blueprintjs/core';
import { currentNetwork } from 'utils/classifiers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function HintHowToTopup() {
  const { t } = useTranslation();
  const link = {
    mainnet: {
      text: 'the Fast-BTC-Relay',
      link: '/fast-btc',
    },
    testnet: {
      text: 'the RSK Testnet faucet',
      link: 'https://faucet.rsk.co/',
    },
  };

  return (
    <div>
      <p>
        <Icon icon="info-sign" /> {t(translations.hintHowToTopUp.hintOne)}
      </p>{' '}
      <p>
        {' '}
        {t(translations.hintHowToTopUp.hintTwo)}{' '}
        <a
          href={link[currentNetwork].link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link[currentNetwork].text}
        </a>
        , {t(translations.hintHowToTopUp.hintThree)}
      </p>
    </div>
  );
}

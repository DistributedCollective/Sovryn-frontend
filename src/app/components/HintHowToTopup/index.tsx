import React from 'react';
import { Icon } from '@blueprintjs/core';
import { currentNetwork } from 'utils/classifiers';

export function HintHowToTopup() {
  const link = {
    mainnet: {
      text: 'the Fast-BTC-Relay',
      link: 'https://fastbtc.sovryn.app/',
    },
    testnet: {
      text: 'the RSK Testnet faucet',
      link: 'https://faucet.rsk.co/',
    },
  };

  return (
    <div>
      <p>
        <Icon icon="info-sign" /> You're connected! To trade and lend with
        Sovryn, you will need some Bitcoin on the RSK platform.
      </p>{' '}
      <p>
        {' '}
        Top up your wallet at{' '}
        <a
          href={link[currentNetwork].link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link[currentNetwork].text}
        </a>
        , and get started!
      </p>
    </div>
  );
}

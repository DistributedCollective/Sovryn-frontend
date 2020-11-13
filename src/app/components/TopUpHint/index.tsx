import React from 'react';
import { currentNetwork } from 'utils/classifiers';

export function TopUpHint() {
  const links = {
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
    <>
      While you wait, you can top up your wallet from{' '}
      <a
        href={links[currentNetwork].link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {links[currentNetwork].text}
      </a>
    </>
  );
}

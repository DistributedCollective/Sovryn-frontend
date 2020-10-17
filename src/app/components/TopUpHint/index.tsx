import React from 'react';
import { currentNetwork } from 'utils/classifiers';

export function TopUpHint() {
  const links = {
    mainnet: {
      text: 'the Fast-BTC-Relay',
      link: '',
    },
    testnet: {
      text: 'the RSK Testnet faucet',
      link: '',
    },
  };

  return (
    <p>
      While you wait, you can top up your wallet from{' '}
      {links[currentNetwork].text}
    </p>
  );
}

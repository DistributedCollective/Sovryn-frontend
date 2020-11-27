import React from 'react';
import { Icon } from '@blueprintjs/core';
import { ConnectWalletButton } from '../../containers/ConnectWalletButton';

export function HintHowToConnect() {
  return (
    <div>
      <p>
        <Icon icon="info-sign" /> Before you can trade and lend with Sovryn, you
        need to connect to the RSK network.
      </p>{' '}
      <p>
        {' '}
        Get instructions on how to connect with{' '}
        <a
          href="https://sovryn.app/blog/metamask-wallet-for-sovryn.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Metamask{' '}
        </a>
        or{' '}
        <a
          href="https://sovryn.app/blog/using-nifty-wallet-for-sovryn.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nifty{' '}
        </a>
        and then connect your wallet:
      </p>
      <ConnectWalletButton />
    </div>
  );
}

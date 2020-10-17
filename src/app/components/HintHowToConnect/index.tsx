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
          href="https://medium.com/sovryn/setting-up-metamask-for-sovryn-on-mainnet-cbf798ca0c9a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Metamask{' '}
        </a>
        or{' '}
        <a
          href="https://medium.com/sovryn/using-nifty-wallet-for-sovryn-bf95f214b41"
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

import React from 'react';
import { useWalletContext } from '@sovryn/react-wallet';
import { Card } from '../Card';
import { Button } from '../Button';
import { useIsConnected } from '../../../../hooks/useAccount';

export function EngageWalletStep() {
  const { connect } = useWalletContext();
  const connected = useIsConnected();
  return (
    <Card step={1} title="Engage Wallet" disabled={connected}>
      <div className="disable-content" style={{ height: 180 }}>
        <p>
          Engage a browser, mobile or hardware wallet connected to the{' '}
          <a href="https://rsk.co" target="_blank" rel="noreferrer noopener">
            RSK Mainnet
          </a>
        </p>
        <p>
          Don’t have a wallet? Sovryn recommends{' '}
          <a
            href="https://liquality.io/atomic-swap-wallet.html"
            target="_blank"
            rel="noreferrer noopener"
          >
            Liquality wallet
          </a>
        </p>
      </div>
      <Button
        text="Engage Wallet"
        disabled={connected}
        onClick={() => connect()}
      />
    </Card>
  );
}

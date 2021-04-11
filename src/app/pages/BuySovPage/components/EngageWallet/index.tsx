import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { useDispatch } from 'react-redux';
import { actions } from 'app/containers/EngageWalletDialog/slice';
import { useIsConnected } from '../../../../hooks/useAccount';

export function EngageWalletStep() {
  const dispatch = useDispatch();
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
        onClick={() => dispatch(actions.showModal(true))}
      />
    </Card>
  );
}

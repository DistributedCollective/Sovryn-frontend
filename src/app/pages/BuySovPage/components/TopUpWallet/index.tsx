import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { useIsConnected } from '../../../../hooks/useAccount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { Asset } from '../../../../../types/asset';
import { FastBtcDialog } from '../../../../containers/FastBtcDialog';

export function TopUpWallet() {
  const connected = useIsConnected();
  const { value: balance } = useAssetBalanceOf(Asset.RBTC);
  const [open, setOpen] = useState(false);
  return (
    <Card step={2} title="Top up RBTC" disabled={balance !== '0'}>
      <div className="disable-content" style={{ height: 180 }}>
        <p>
          You will need RBTC in your wallet to buy SOV and pay gas fees on RSK
          Mainnet.
        </p>
        <p>
          <br />
          <a
            href="https://liquality.io/atomic-swap-wallet.html"
            target="_blank"
            rel="noreferrer noopener"
          >
            Learn about RBTC on RSK
          </a>
        </p>
      </div>
      <Button
        text="Top Up Wallet"
        disabled={!connected}
        onClick={() => setOpen(true)}
      />
      <FastBtcDialog isOpen={open} onClose={() => setOpen(false)} />
    </Card>
  );
}

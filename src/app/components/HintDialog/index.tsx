import React, { useState, useEffect } from 'react';
import { HintHowToConnect } from '../HintHowToConnect';
import { HintHowToTopup } from '../HintHowToTopup';
import { Button, Dialog } from '@blueprintjs/core';
import { useTokenBalanceOf } from 'app/hooks/useTokenBalanceOf';
import { useIsConnected } from 'app/hooks/useAccount';
import { Asset } from 'types/asset';

export function HintDialog() {
  const [show, setShow] = useState<boolean>(false);
  const connected = useIsConnected();
  const { value, loading } = useTokenBalanceOf(Asset.BTC);

  useEffect(() => {
    if (!connected || (!loading && parseFloat(value) === 0)) {
      const delay = setTimeout(() => {
        setShow(true);
      }, 1000);
      return () => clearTimeout(delay);
    } else if (connected && !loading && parseFloat(value) > 0) {
      setShow(false);
    }
  }, [connected, loading, value]);

  return (
    <Dialog isOpen={show} className="bg-secondary p-3">
      <div className="container">
        <div className="d-flex justify-content-between mb-3">
          <h4>Sovryn Tips</h4>
          <Button icon="cross" onClick={() => setShow(false)} minimal />
        </div>
        {!connected && <HintHowToConnect />}
        {connected && !loading && parseFloat(value) === 0 && <HintHowToTopup />}
      </div>
    </Dialog>
  );
}

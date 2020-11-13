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
    if (connected && !loading && parseFloat(value) > 0) {
      setShow(false);
    } else if (!connected || (!loading && parseFloat(value) === 0)) {
      const delay = setTimeout(() => {
        setShow(true);
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [connected, loading, value]);

  return (
    <Dialog isOpen={show} className="bg-secondary p-3">
      <div className="container">
        <div className="d-flex justify-content-between mb-3">
          <h3 className="text-teal">Sovryn Tips</h3>
          <Button
            icon="cross"
            style={{ marginRight: '-10px', marginTop: '-10px' }}
            className="text-white"
            onClick={() => setShow(false)}
            minimal
          />
        </div>
        {!connected && <HintHowToConnect />}
        {connected && !loading && parseFloat(value) === 0 && <HintHowToTopup />}
      </div>
    </Dialog>
  );
}

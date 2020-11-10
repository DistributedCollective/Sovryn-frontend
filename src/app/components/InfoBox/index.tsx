import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@blueprintjs/core';

export function InfoBox(props) {
  const [show, setShow] = useState<any>(true);

  useEffect(() => {
    try {
      setShow(window.localStorage.getItem('showInfoBox') !== 'false');
    } catch (e) {
      //
    }
  }, [show]);

  function closeInfoBox() {
    setShow(false);
    try {
      window.localStorage.setItem('showInfoBox', 'false');
    } catch (e) {
      //
    }
  }

  return (
    <div className="mt-3" style={{ display: show ? 'block' : 'none' }}>
      <div className="sovryn-border p-3">
        <Button
          icon="cross"
          onClick={() => closeInfoBox()}
          minimal
          className="float-right"
        />
        <p className="pt-3">
          <Icon icon="info-sign" className="mr-2" />
          Need help making a transaction? Read our guide on{' '}
          <a
            href="https://sovryn.app/blog/how-to-earn-and-leverage-bitcoin.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            how to trade and lend with Sovryn
          </a>
          .
        </p>
      </div>
    </div>
  );
}

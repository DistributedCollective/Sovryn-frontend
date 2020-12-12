import React, { useState, useEffect } from 'react';
import { FastBTCTutorialComponent } from '../component';
import { useAccount, useIsConnected } from '../../../hooks/useAccount';

export function FastBTCTutorialDialog() {
  const [show, setShow] = useState<boolean>(false);
  const isConnected = useIsConnected();
  const address = useAccount();

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    if (show) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  });

  function handleClose() {
    // storage.session.setItem('closedFastBTC', 'true');
    setShow(false);
  }

  //TODO: On open, check session storage for preference

  //TODO: Write checks for if component should render (eg is connected && balance === 0)

  return (
    <>
      {show && (
        <div className="d-none d-md-block">
          <FastBTCTutorialComponent
            isConnected={isConnected}
            address={address}
            handleClose={handleClose}
          />
        </div>
      )}
    </>
  );
}

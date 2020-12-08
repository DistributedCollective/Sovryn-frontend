import React, { useState, useEffect } from 'react';
import { FastBTCTutorialComponent } from '../component';
import * as storage from 'utils/storage';

export function FastBTCTutorialDialog() {
  //Check if previously connected, currently connected to RSK, currently wallet is connected, closed before
  const [show, setShow] = useState<boolean>(true);

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

  //On open, check session storage for preference

  return (
    <>
      {show && (
        <div className="d-none d-md-block">
          <FastBTCTutorialComponent />
        </div>
      )}
    </>
  );
}

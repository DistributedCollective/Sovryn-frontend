import React, { useEffect, useState } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import badgerQr from 'assets/images/tutorial/badger_qr.svg';
import speech2 from 'assets/images/tutorial/speech2.svg';
import { Sovryn } from 'utils/sovryn';

export function Screen3() {
  const [fade, setFade] = useState(false);

  function connect() {
    Sovryn.connectTo('walletconnect');
  }

  useEffect(() => {
    connect();
    return function cleanup() {
      var walletConnectModal = document.getElementById('walletconnect-wrapper');
      walletConnectModal?.remove();
    };
  }, []);

  return (
    <>
      <div>
        <div className="badger-qr position-absolute">
          <img src={badgerQr} alt="" className="h-100 w-100" />
        </div>
        <div className="speech2 position-absolute">
          <img src={speech2} alt="" className="h-100 w-100" />
        </div>
        <p className="speech-qr position-absolute">
          Scan qr with a wallet-connect compatible wallet
        </p>
      </div>
    </>
  );
}

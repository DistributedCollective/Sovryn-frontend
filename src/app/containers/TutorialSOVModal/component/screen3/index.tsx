import React, { useEffect } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import badgerQr from 'assets/images/tutorial/badger_qr.svg';
import { Sovryn } from 'utils/sovryn';

export function Screen3() {
  const { t } = useTranslation();
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

  // TODO: Handle wrong network error

  return (
    <>
      <div>
        <div className="badger-qr position-absolute">
          <img src={badgerQr} alt="" className="h-100 w-100" />
        </div>
        <div className="speech2 position-absolute"></div>
        <p className="speech-qr position-absolute">
          {t(translations.rskConnectTutorial.speech_qr_code)}
        </p>
      </div>
    </>
  );
}

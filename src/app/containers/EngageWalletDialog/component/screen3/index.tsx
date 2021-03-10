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
        <div className="badger-qr tw-absolute">
          <img src={badgerQr} alt="" className="tw-h-full tw-w-full" />
        </div>
        <div className="speech2 tw-absolute" />
        <p className="speech-qr tw-absolute">
          {t(translations.rskConnectTutorial.speech_qr_code)}
        </p>
      </div>
    </>
  );
}

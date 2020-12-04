import React, { useEffect, useState } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import badgerQr from 'assets/images/tutorial/badger_qr.svg';
import { Sovryn } from 'utils/sovryn';
import { SovrynNetwork } from 'utils/sovryn/sovryn-network';

export function Screen3() {
  const [fade, setFade] = useState(false);

  function connect() {
    Sovryn.connectTo('walletconnect');
  }

  function closeModal() {
    const modal = document.getElementById('walletconnect-wrapper');
    modal?.classList.add('d-none');
  }

  useEffect(() => {
    connect();
  }, []);

  return (
    <>
      <div>
        <div className="badger-qr position-absolute">
          <img
            src={badgerQr}
            alt=""
            className="h-100 w-100"
            onClick={() => closeModal()}
          />
        </div>
      </div>
    </>
  );
}

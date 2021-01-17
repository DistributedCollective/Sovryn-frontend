import React, { useState } from 'react';
import browserIcon from 'assets/images/tutorial/brower_icon.svg';
import mobileIcon from 'assets/images/tutorial/mobile_icon.svg';
import hardwareIcon from 'assets/images/tutorial/hardware_icon.svg';
import badger1 from 'assets/images/tutorial/badger_1.svg';
import planet from 'assets/images/tutorial/planet.svg';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Alert } from '@blueprintjs/core';

interface Props {
  handleClick: (num: Number) => void;
  onNetwork: boolean;
  handleEngage: (wallet?: string) => void;
}

export function Screen1(props: Props) {
  const { t } = useTranslation();

  const [mobileAlert, setMobileAlert] = useState(false);

  function handleBrowserClick() {
    props.handleClick(5);
  }

  function handleMobileWalletClick() {
    props.handleEngage('walletconnect');
    setMobileAlert(false);
  }

  return (
    <>
      <div className="screen1">
        <div className="badger1 position-absolute">
          <img src={badger1} alt="" className="h-100 w-100" />
        </div>
        <div className="planet position-absolute">
          <img src={planet} alt="" className="h-100 w-100" />
        </div>

        <div className="wallet-holder d-flex flex-row justify-content-center align-items-center">
          <div
            className="wallet-block d-flex justify-content-center align-items-center flex-column"
            onClick={handleBrowserClick}
          >
            <div
              className="wallet-icon"
              style={{ backgroundImage: `url(${browserIcon})` }}
            />
            <div className="wallet-title">
              {t(translations.rskConnectTutorial.browser_wallet)}
            </div>
          </div>

          <div
            className="wallet-block d-flex justify-content-center align-items-center flex-column"
            onClick={() => setMobileAlert(true)}
          >
            <div
              className="wallet-icon"
              style={{ backgroundImage: `url(${mobileIcon})` }}
            />
            <div className="wallet-title">
              {t(translations.rskConnectTutorial.mobile_wallet)}
            </div>
          </div>

          <div className="wallet-block disabled d-flex justify-content-center align-items-center flex-column">
            <div className="coming-soon" />
            <div
              className="wallet-icon"
              style={{ backgroundImage: `url(${hardwareIcon})` }}
            />
            <div className="wallet-title">
              {t(translations.rskConnectTutorial.hardware_wallet)}
            </div>
          </div>
        </div>
      </div>

      <Alert
        confirmButtonText="Continue"
        isOpen={mobileAlert}
        onClose={handleMobileWalletClick}
      >
        <p className="mt-2 mb-0">
          {t(translations.rskConnectTutorial.mobile_wallet_alert_line1)}
        </p>
        <p className="mt-2 mb-0 font-weight-bold">
          {t(translations.rskConnectTutorial.mobile_wallet_alert_line2)}
        </p>
      </Alert>
    </>
  );
}

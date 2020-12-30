import React from 'react';
import rectangle from 'assets/images/tutorial/screen1_rectangle.svg';
import browserIcon from 'assets/images/tutorial/brower_icon.svg';
import mobileIcon from 'assets/images/tutorial/mobile_icon.svg';
import hardwareIcon from 'assets/images/tutorial/hardware_icon.svg';
import badger1 from 'assets/images/tutorial/badger_1.svg';
import planet from 'assets/images/tutorial/planet.svg';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

interface Props {
  handleClick: (num: Number) => void;
  onNetwork: boolean;
  handleEngage: () => void;
}

export function Screen1(props: Props) {
  const { t } = useTranslation();

  function handleBrowserClick() {
    if (props.onNetwork === true) {
      props.handleEngage();
    } else {
      props.handleClick(2);
    }
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
        <div className="browser-wallet" onClick={handleBrowserClick}>
          <div className="rectangle1">
            <img src={rectangle} alt="" />
          </div>
          <div className="browser-icon position-absolute">
            <img
              src={browserIcon}
              alt="browser wallet icon"
              className="h-100 w-100"
            />
          </div>
          <div className="browser-wallet-text position-absolute">
            <p>{t(translations.rskConnectTutorial.browser_wallet)}t</p>
          </div>
        </div>
        <div className="mobile-wallet">
          <div className="rectangle2">
            <img src={rectangle} alt="" />
          </div>
          <div className="mobile-icon position-absolute">
            <img
              src={mobileIcon}
              alt="browser wallet icon"
              className="h-100 w-100"
            />
          </div>
          <div className="mobile-wallet-text position-absolute">
            <p>{t(translations.rskConnectTutorial.mobile_wallet)}</p>
          </div>
        </div>
        <div className="hardware-wallet">
          <div className="rectangle3">
            <img src={rectangle} alt="" />
          </div>
          <div className="hardware-icon position-absolute">
            <img
              src={hardwareIcon}
              alt="browser wallet icon"
              className="h-100 w-100"
            />
          </div>
          <div className="hardware-wallet-text position-absolute">
            <p>{t(translations.rskConnectTutorial.hardware_wallet)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

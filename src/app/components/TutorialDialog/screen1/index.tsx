import React from 'react';
import screen1Bg from 'assets/images/tutorial/screen_1_background.svg';
import rectangle from 'assets/images/tutorial/screen1_rectangle.svg';
import browserIcon from 'assets/images/tutorial/brower_icon.svg';
import mobileIcon from 'assets/images/tutorial/mobile_icon.svg';
import hardwareIcon from 'assets/images/tutorial/hardware_icon.svg';
import { currentChainId } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

interface Props {
  handleClick: (num: Number) => void;
  onMainnet: boolean;
  handleEngage: () => void;
}

export function Screen1(props: Props) {
  const { t } = useTranslation();
  function handleBrowserClick() {
    if (
      window.ethereum &&
      parseInt(window.ethereum.chainId) === currentChainId
    ) {
      props.handleEngage();
    } else {
      props.handleClick(2);
    }
  }

  return (
    <>
      <div className="screen1">
        <div className="screen1-background">
          <img src={screen1Bg} alt="" />
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
            <p>Browser Wallet</p>
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
            <p>Mobile Wallet</p>
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
            <p>Hardware Wallet</p>
          </div>
        </div>
      </div>
    </>
  );
}

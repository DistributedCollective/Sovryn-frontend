import React from 'react';
import badger1 from 'assets/images/tutorial/badger_1.svg';
import planet from 'assets/images/tutorial/planet.svg';

import metaMaskIcon from 'assets/wallets/metamask.svg';
import niftyIcon from 'assets/wallets/nifty.png';
import liqualityIcon from 'assets/wallets/liquality.svg';
import portisIcon from 'assets/wallets/portis.svg';
import { toaster } from '../../../../../utils/toaster';

interface Props {
  handleClick: (num: Number) => void;
  onNetwork: boolean;
  handleEngage: (wallet?: string) => void;
}

function detectInjectableWallet() {
  if (!window.ethereum) {
    return 'none';
  }

  if (window.ethereum?.isLiquality) {
    return 'liquality';
  }

  if (window.ethereum?.isNiftyWallet) {
    return 'nifty';
  }

  if (window.ethereum?.isMetaMask) {
    return 'metamask';
  }

  return 'unknown';
}

function getWalletTitle() {
  switch (detectInjectableWallet()) {
    default:
      return 'Browser Extension';
    case 'liquality':
      return 'Liquality Wallet';
    case 'nifty':
      return 'Nifty Wallet';
    case 'metamask':
      return 'MetaMask';
  }
}

function getLogoImage() {
  switch (detectInjectableWallet()) {
    default:
      return metaMaskIcon;
    case 'liquality':
      return liqualityIcon;
    case 'nifty':
      return niftyIcon;
    case 'metamask':
      return metaMaskIcon;
  }
}

export function BrowserWallets(props: Props) {
  function handleBrowserClick() {
    if (props.onNetwork) {
      props.handleEngage('injected');
    } else {
      props.handleClick(2);
    }
  }

  function handlePortisClick() {
    props.handleEngage('portis');
    toaster.show({
      intent: 'success',
      message:
        'Portis wallet will launch soon, please wait - it may take some time for extension to prepare.',
    });
  }

  return (
    <>
      <div className="screen1">
        <div className="badger1 tw-absolute">
          <img src={badger1} alt="" className="tw-h-full tw-w-full" />
        </div>
        <div className="planet tw-absolute">
          <img src={planet} alt="" className="tw-h-full tw-w-full" />
        </div>
        <div className="wallet-holder tw-flex tw-flex-row tw-justify-center tw-items-center">
          {detectInjectableWallet() !== 'none' ? (
            <>
              <div
                className="wallet-block tw-flex tw-justify-center tw-items-center tw-flex-col"
                onClick={handleBrowserClick}
              >
                <div
                  className="wallet-icon"
                  style={{ backgroundImage: `url(${getLogoImage()})` }}
                />
                <div className="wallet-title">{getWalletTitle()}</div>
              </div>
            </>
          ) : (
            <a
              href="https://chrome.google.com/webstore/detail/liquality-wallet/kpfopkelmapcoipemfendmdcghnegimn"
              target="_blank"
              rel="noreferrer noopener"
              className="wallet-block tw-flex tw-justify-center tw-items-center tw-flex-col"
            >
              <div
                className="wallet-icon"
                style={{ backgroundImage: `url(${liqualityIcon})` }}
              />
              <div className="wallet-title">Get Liquality Wallet</div>
            </a>
          )}

          <div
            className="wallet-block tw-flex tw-justify-center tw-items-center tw-flex-col"
            onClick={handlePortisClick}
          >
            <div
              className="wallet-icon"
              style={{ backgroundImage: `url(${portisIcon})` }}
            />
            <div className="wallet-title">Portis</div>
          </div>

          {detectInjectableWallet() === 'none' ? (
            <a
              href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
              target="_blank"
              rel="noreferrer noopener"
              className="wallet-block tw-flex tw-justify-center tw-items-center tw-flex-col"
            >
              <div
                className="wallet-icon"
                style={{ backgroundImage: `url(${niftyIcon})` }}
              />
              <div className="wallet-title">Get Nifty Wallet</div>
            </a>
          ) : (
            <div style={{ width: 200 }} />
          )}
        </div>
      </div>
    </>
  );
}

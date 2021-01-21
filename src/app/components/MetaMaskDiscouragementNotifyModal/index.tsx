/**
 *
 * MetaMaskDiscouragementNotifyModal
 *
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@blueprintjs/core';
import { local } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import { TradeButton } from '../TradeButton';
import logo from './logo.svg';

interface Props {}

const SESSION_KEY = 'mm-notify-shown';

const testForMetaMask = () => {
  return !!(window?.ethereum?.isMetaMask && !window?.ethereum?.isNiftyWallet);
};

export function MetaMaskDiscouragementNotifyModal(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const [show, setShow] = useState(!local.getItem(SESSION_KEY));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setShow(!local.getItem(SESSION_KEY));
  }, []);

  const handleClose = () => {
    local.setItem(SESSION_KEY, '1');
    setShow(false);
  };

  return (
    <Dialog
      isOpen={show}
      onClose={handleClose}
      canOutsideClickClose={false}
      isCloseButtonShown={false}
      canEscapeKeyClose={false}
      className="fw-900 p-4"
    >
      <div className="font-family-montserrat font-weight-light text-center mfw-600 mx-auto">
        <img src={logo} alt="MetaMask" className="mb-3" />
        <div
          className="font-weight-bold text-center mb-4"
          style={{ fontSize: '25px' }}
        >
          Caution… No Really
        </div>
        {testForMetaMask() ? <MetaMaskAlert /> : <GeneralAlert />}
      </div>

      <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
        <Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          label="I have read and understand that I am responsible for my own Sovrynity"
        />
        <div className="mt-4">
          <TradeButton
            text="I Understand"
            disabled={!checked}
            onClick={handleClose}
            textColor="var(--teal)"
          />
        </div>
      </div>
    </Dialog>
  );
}

function GeneralAlert() {
  return (
    <>
      <p className="font-weight-bold">
        SOVRYN is a decentralized bitcoin trading and lending platform, the
        first of it kind!
      </p>
      <div className="px-3 text-left">
        <p>
          Only you control and have access to your wealth, any actions you take
          could cause a potential loss of funds.
        </p>
        <p>
          Particularly please be sure to check all transaction fee prices before
          proceeding as third party wallets may automatically present high fees.
        </p>
        <p>
          Please visit our{' '}
          <a
            href="https://sovryn-1.gitbook.io/sovryn/"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            FAQ
          </a>{' '}
          if you have any questions.
        </p>
        <p>
          If you’re new to DeFi, here is the{' '}
          <a
            href="https://sovryn-1.gitbook.io/sovryn/"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            tutorial
          </a>{' '}
          on how to use SOVRYN.
        </p>
      </div>
    </>
  );
}

function MetaMaskAlert() {
  return (
    <>
      <p className="font-weight-bold">
        We noticed you have MetaMask installed.
      </p>
      <div className="px-3 text-left">
        <p>
          There are known issues when using MetaMask with SOVRYN. We suggest
          using a browser wallet like{' '}
          <a
            href="https://chrome.google.com/webstore/detail/liquality-wallet/kpfopkelmapcoipemfendmdcghnegimn"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            Liquality Wallet
          </a>{' '}
          or{' '}
          <a
            href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            Nifty Wallet
          </a>
          . If you wish to continue with MetaMask please be aware of the
          following know errors:
        </p>

        <p className="font-weight-bold mb-1">• High default gas price</p>
        <p>&nbsp;&nbsp;set your gas price manually to 0.06 GWEI</p>

        <p className="font-weight-bold mb-1">
          • ETH checksum ETH instead of RSK checksume
        </p>
        <p>
          &nbsp;&nbsp;use lower case addresses as receiver for manual
          transactionsI
        </p>

        <p className="font-weight-bold mb-1">
          • Shows price as ETH instead of (r)BTC
        </p>
        <p>
          &nbsp;&nbsp;currently we suggest checking your token balances in the
          SOVRYN My Wallet section.
        </p>
      </div>
    </>
  );
}

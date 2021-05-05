/**
 *
 * MetaMaskDiscouragementNotifyModal
 *
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Checkbox } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import { local } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import logo from './logo.svg';
import SalesButton from '../SalesButton';
import { isMobile } from 'utils/helpers';

interface Props {}

const SESSION_KEY = 'mm-notify-shown';

const testForMetaMask = () => {
  const { ethereum } = window as any;
  return !!(ethereum?.isMetaMask && !ethereum?.isNiftyWallet);
};

const shouldModalBeVisible = () => !isMobile() && !local.getItem(SESSION_KEY);

export function MetaMaskDiscouragementNotifyModal(props: Props) {
  const { t } = useTranslation();
  const [show, setShow] = useState(shouldModalBeVisible());
  const [checked, setChecked] = useState(false);

  useEffect(() => setShow(shouldModalBeVisible()), []);

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
          {t(translations.notifyDialog.heading)}
        </div>
        {testForMetaMask() ? <MetaMaskAlert /> : <GeneralAlert />}
      </div>

      <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
        <Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          label={t(translations.notifyDialog.acceptTerms)}
        />
        <div className="mt-4">
          <SalesButton
            text={t(translations.notifyDialog.salesBtn)}
            onClick={handleClose}
            disabled={!checked}
          />
        </div>
      </div>
    </Dialog>
  );
}

function GeneralAlert() {
  const { t } = useTranslation();
  return (
    <>
      <p className="font-weight-bold">
        {t(translations.notifyDialog.generalAlert.p1)}
      </p>
      <div className="px-3 text-left">
        <p>{t(translations.notifyDialog.generalAlert.p2)}</p>
        <p>{t(translations.notifyDialog.generalAlert.p3)}</p>
        <p>
          {t(translations.notifyDialog.generalAlert.p4_1)}
          <a
            href="https://wiki.sovryn.app/en/getting-started/faq-general"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t(translations.notifyDialog.generalAlert.p4_2)}
          </a>
          {t(translations.notifyDialog.generalAlert.p4_3)}
        </p>
        <p>
          {t(translations.notifyDialog.generalAlert.p5_1)}
          <a
            href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t(translations.notifyDialog.generalAlert.p5_2)}
          </a>
          {t(translations.notifyDialog.generalAlert.p5_3)}
        </p>
      </div>
    </>
  );
}

function MetaMaskAlert() {
  const { t } = useTranslation();

  const StyledList = styled.ul`
    padding-inline-start: 0px; //reset default browser list style
    margin-left: 1rem;
  `;

  return (
    <>
      <p className="font-weight-bold">
        {t(translations.notifyDialog.metamaskAlert.p1)}
      </p>
      <div className="px-3 text-left">
        <p>
          {t(translations.notifyDialog.metamaskAlert.p2_1)}
          <a
            href="https://chrome.google.com/webstore/detail/liquality-wallet/kpfopkelmapcoipemfendmdcghnegimn"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t(translations.notifyDialog.metamaskAlert.p2_2)}
          </a>
          {t(translations.notifyDialog.metamaskAlert.p2_3)}
          <a
            href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
            className="font-weight-light text-gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t(translations.notifyDialog.metamaskAlert.p2_4)}
          </a>
          {t(translations.notifyDialog.metamaskAlert.p2_5)}
        </p>

        <StyledList>
          <li className="mb-3">
            <div className="font-weight-bold mb-1">
              {t(
                translations.notifyDialog.metamaskAlert.knownErrors
                  .defaultGasPrice.title,
              )}
            </div>
            <div>
              {t(
                translations.notifyDialog.metamaskAlert.knownErrors
                  .defaultGasPrice.description,
              )}
            </div>
          </li>
          <li className="mb-3">
            <div className="font-weight-bold mb-1">
              {t(
                translations.notifyDialog.metamaskAlert.knownErrors.checksum
                  .title,
              )}
            </div>
            <div>
              {t(
                translations.notifyDialog.metamaskAlert.knownErrors.checksum
                  .description,
              )}
            </div>
          </li>
          <li className="mb-3">
            <div className="font-weight-bold mb-1">
              {t(
                translations.notifyDialog.metamaskAlert.knownErrors.price.title,
              )}
            </div>
            <div>
              {t(
                translations.notifyDialog.metamaskAlert.knownErrors.price
                  .description,
              )}
            </div>
          </li>
        </StyledList>
      </div>
    </>
  );
}

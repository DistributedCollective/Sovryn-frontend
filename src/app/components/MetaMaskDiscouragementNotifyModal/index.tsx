import { Checkbox } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { isMobile } from 'utils/helpers';

import { translations } from '../../../locales/i18n';
import { local } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import SalesButton from '../SalesButton';
import logo from './logo.svg';

interface Props {}

const SESSION_KEY = 'mm-notify-shown';

const testForMetaMask = () => {
  const { ethereum } = window;
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
      className="tw-w-full tw-max-w-4xl tw-p-6"
    >
      <div className="tw-font-light tw-text-center tw-w-full tw-max-w-2xl tw-mx-auto">
        <img src={logo} alt="MetaMask" className="tw-mb-4" />
        <div
          className="tw-font-bold tw-text-center tw-mb-6"
          style={{ fontSize: '25px' }}
        >
          {t(translations.notifyDialog.heading)}
        </div>
        {/* {testForMetaMask() ? <MetaMaskAlert /> : <GeneralAlert />} */}
        <GeneralAlert />
      </div>

      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-12 tw-mb-6">
        <Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          label={t(translations.notifyDialog.acceptTerms)}
        />
        <div className="tw-mt-6">
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
      <p className="tw-font-bold">
        {t(translations.notifyDialog.generalAlert.p1)}
      </p>
      <div className="tw-px-4 tw-text-left">
        <p>{t(translations.notifyDialog.generalAlert.p2)}</p>
        <p>{t(translations.notifyDialog.generalAlert.p3)}</p>
        <p>
          {t(translations.notifyDialog.generalAlert.p4_1)}
          <a
            href="https://wiki.sovryn.app/en/getting-started/faq-general"
            className="tw-font-light tw-text-primary"
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
            className="tw-font-light tw-text-primary"
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
      <p className="tw-font-bold">
        {t(translations.notifyDialog.metamaskAlert.p1)}
      </p>
      <div className="tw-px-4 tw-text-left">
        <p>
          {t(translations.notifyDialog.metamaskAlert.p2_1)}
          <a
            href="https://chrome.google.com/webstore/detail/liquality-wallet/kpfopkelmapcoipemfendmdcghnegimn"
            className="tw-font-light tw-text-primary"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t(translations.notifyDialog.metamaskAlert.p2_2)}
          </a>
          {t(translations.notifyDialog.metamaskAlert.p2_3)}
          <a
            href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
            className="tw-font-light tw-text-primary"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t(translations.notifyDialog.metamaskAlert.p2_4)}
          </a>
          {t(translations.notifyDialog.metamaskAlert.p2_5)}
        </p>

        <StyledList>
          <li className="tw-mb-4">
            <div className="tw-font-bold tw-mb-1">
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
          <li className="tw-mb-4">
            <div className="tw-font-bold tw-mb-1">
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
          <li className="tw-mb-4">
            <div className="tw-font-bold tw-mb-1">
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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'utils/helpers';
import { translations } from '../../../locales/i18n';
import { local } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import SalesButton from '../SalesButton';
import { Checkbox } from '../Checkbox';
import logo from 'assets/images/sovryn-logo-white.svg';

// previously MetaMask disclaimer, 'mm-…' remains to not annoy users.
const SESSION_KEY = 'mm-notify-shown';

const shouldModalBeVisible = () => !isMobile() && !local.getItem(SESSION_KEY);

export const FirstVisitDisclaimerDialog: React.FC = () => {
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
      <div className="tw-font-normal tw-text-center tw-w-full tw-max-w-2xl tw-mx-auto">
        <img src={logo} alt="Sovryn Logo" className="tw-mb-4" />
        <div
          className="tw-font-bold tw-text-center tw-mb-6"
          style={{ fontSize: '25px' }}
        >
          {t(translations.notifyDialog.heading)}
        </div>
        <GeneralAlert />
      </div>

      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-12 tw-mb-6">
        <Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          label={t(translations.notifyDialog.acceptTerms)}
          data-action-id="accept-terms-checkbox"
        />
        <div className="tw-mt-6">
          <SalesButton
            text={t(translations.notifyDialog.salesBtn)}
            onClick={handleClose}
            disabled={!checked}
            data-action-id="accept-terms-submit-button"
          />
        </div>
      </div>
    </Dialog>
  );
};

const GeneralAlert: React.FC = () => {
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
            className="tw-font-normal tw-text-primary"
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
            className="tw-font-normal tw-text-primary"
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
};

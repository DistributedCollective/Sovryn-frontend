import React, { useCallback, useState } from 'react';
import { Dialog } from '../../containers/Dialog/Loadable';
import logo from 'assets/images/sovryn-logo-staked.svg';
import { isMobile } from 'utils/helpers';
import { noop } from '../../constants';
import { Checkbox } from '@blueprintjs/core';
import SalesButton from '../SalesButton';
import { WarningContainer, WarningTextContent } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export const MobileBrowsersWarningDialog: React.FC = () => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(isMobile());

  // eslint-disable-next-line prettier/prettier
  const onCheckboxClick = useCallback(() => setChecked(prevValue => !prevValue), [setChecked]);

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={noop}
      isCloseButtonShown={false}
      className="w-auto"
    >
      <WarningContainer className="pt-2 px-4 text-center">
        <img src={logo} alt="Sovryn" className="mb-5" />

        <WarningTextContent>
          <p>
            {t(translations.mobileBrowsersWarningDialog.content.paragraph1)}
          </p>
          <p className="mt-4">
            {t(translations.mobileBrowsersWarningDialog.content.paragraph2)}
          </p>
        </WarningTextContent>

        <div className="mt-5 mb-4">
          <Checkbox
            checked={checked}
            onChange={onCheckboxClick}
            label={t(translations.mobileBrowsersWarningDialog.acceptTerms)}
          />
          <div className="mt-4">
            <SalesButton
              text={t(translations.mobileBrowsersWarningDialog.salesBtn)}
              onClick={handleClose}
              disabled={!checked}
            />
          </div>
        </div>
      </WarningContainer>
    </Dialog>
  );
};

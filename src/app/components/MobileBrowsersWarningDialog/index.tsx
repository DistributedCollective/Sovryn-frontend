import React, { useCallback, useState } from 'react';
import { Dialog } from '../../containers/Dialog/Loadable';
import logo from 'assets/images/sovryn-logo-horz-white.png';
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

  const onCheckboxClick = useCallback(
    () => setChecked(prevValue => !prevValue),
    [setChecked],
  );

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={noop}
      isCloseButtonShown={false}
      className="tw-w-auto tw-text-center"
    >
      <WarningContainer className="tw-pt-2 sm:tw-px-8 tw-text-center">
        <img src={logo} alt="Sovryn" className="tw-mx-auto tw-mb-12" />

        <WarningTextContent>
          <p>
            {t(translations.mobileBrowsersWarningDialog.content.paragraph1)}
          </p>
          <p className="tw-mt-8">
            {t(translations.mobileBrowsersWarningDialog.content.paragraph2)}
          </p>
        </WarningTextContent>

        <div className="tw-mt-12 tw-mb-8">
          <Checkbox
            checked={checked}
            onChange={onCheckboxClick}
            label={t(translations.mobileBrowsersWarningDialog.acceptTerms)}
            className="tw-text-left"
          />
          <div className="tw-mt-8">
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

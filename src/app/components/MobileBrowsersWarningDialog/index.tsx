import React, { useCallback, useState } from 'react';
import { Dialog } from '../../containers/Dialog/Loadable';
import logo from 'assets/images/sovryn-logo-white-inline.svg';
import { isDesktopViewportWidth } from 'utils/helpers';
import { noop } from '../../constants';
import { Checkbox } from '@blueprintjs/core';
import SalesButton from '../SalesButton';
import { local } from 'utils/storage';
import { WarningContainer, WarningTextContent } from './styled';

const localStorageKey = 'mobile-warning-shown';

export function MobileBrowsersWarningDialog() {
  const [checked, setChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(
    !isDesktopViewportWidth() && !local.getItem(localStorageKey),
  );

  const onCheckboxClick = useCallback(
    () => setChecked(prevValue => !prevValue),
    [setChecked],
  );

  const handleClose = useCallback(() => {
    local.setItem(localStorageKey, '1');
    setIsOpen(false);
  }, [setIsOpen]);

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
            For security the user experience for Sovryn is not yet optimized for
            this device.
          </p>
          <p className="mt-4">Until then Why not try the desktop Version?</p>
        </WarningTextContent>

        <div className="mt-5 mb-4">
          <Checkbox
            checked={checked}
            onChange={onCheckboxClick}
            label="I accept the risks and want to use dapp with my mobile device"
          />
          <div className="mt-4">
            <SalesButton
              text={'I Understand'}
              onClick={handleClose}
              disabled={!checked}
            />
          </div>
        </div>
      </WarningContainer>
    </Dialog>
  );
}

import React, { useCallback, useState } from 'react';
import { Dialog } from '../../containers/Dialog/Loadable';
import logo from 'assets/images/sovryn-logo-white-inline.svg';
import { isDesktopViewportWidth } from 'utils/helpers';
import { noop } from '../../constants';
import { Checkbox } from '@blueprintjs/core';
import SalesButton from '../SalesButton';
import { local } from 'utils/storage';

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
    <Dialog isOpen={isOpen} onClose={noop} isCloseButtonShown={false}>
      <div className="text-center">
        <div>
          <img src={logo} alt="Sovryn" />
        </div>

        <div className="font-family-montserrat font-medium">
          For security the user experience for Sovryn is not yet optimized for
          this device. Until then Why not try the desktop Version?
        </div>

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
      </div>
    </Dialog>
  );
}

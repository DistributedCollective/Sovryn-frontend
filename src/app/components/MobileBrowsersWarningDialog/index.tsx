import React from 'react';
import { Dialog } from '../../containers/Dialog/Loadable';
import logo from 'assets/images/sovryn-logo-white-inline.svg';
import { isDesktopViewportWidth } from 'utils/helpers';
import { noop } from '../../constants';

export function MobileBrowsersWarningDialog() {
  return (
    <Dialog
      isOpen={!isDesktopViewportWidth()}
      onClose={noop}
      isCloseButtonShown={false}
    >
      <div className="text-center">
        <div>
          <img src={logo} alt="Sovryn" />
        </div>

        <div className="font-family-montserrat font-medium">
          For security the user experience for Sovryn is not yet optimized for
          this device. Until then Why not try the desktop Version?
        </div>
      </div>
    </Dialog>
  );
}

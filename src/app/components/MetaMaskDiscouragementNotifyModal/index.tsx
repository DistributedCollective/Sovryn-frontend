/**
 *
 * MetaMaskDiscouragementNotifyModal
 *
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@blueprintjs/core';
import { session } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import { TradeButton } from '../TradeButton';

interface Props {}

const SESSION_KEY = 'mm-notify-shown';

const testForMetaMask = () => {
  return (
    !!(window?.ethereum?.isMetaMask && !window?.ethereum?.isNiftyWallet) &&
    !session.getItem(SESSION_KEY)
  );
};

export function MetaMaskDiscouragementNotifyModal(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const [show, setShow] = useState(testForMetaMask());
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setShow(testForMetaMask());
  }, []);

  const handleClose = () => {
    session.setItem(SESSION_KEY, '1');
    setShow(false);
  };

  return (
    <Dialog
      isOpen={show}
      onClose={handleClose}
      canOutsideClickClose={false}
      isCloseButtonShown={false}
      canEscapeKeyClose={false}
    >
      <div className="p-4">
        <h3 className="mb-4">MetaMask</h3>
        <Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          label="I accept it"
        />
        <div className="text-center mt-4">
          <TradeButton
            text="Confirm"
            disabled={!checked}
            onClick={handleClose}
            textColor="var(--teal)"
          />
        </div>
      </div>
    </Dialog>
  );
}

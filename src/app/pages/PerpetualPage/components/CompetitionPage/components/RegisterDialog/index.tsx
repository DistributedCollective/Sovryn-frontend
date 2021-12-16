import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Checkbox } from '@blueprintjs/core';

import { walletService } from '@sovryn/react-wallet';
import { Dialog, DialogSize } from 'app/containers/Dialog';
import { Input } from 'app/components/Form/Input';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { DummyField } from 'app/components/DummyField';
import { useIsConnected, useAccount } from 'app/hooks/useAccount';
import { notificationUrl } from 'utils/classifiers';

const SIGNED_MSG_BASE = 'Login to backend on %%';

interface IRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterDialog: React.FC<IRegisterDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const account = useAccount();
  const connected = useIsConnected();
  // const { checkMaintenance, States } = useMaintenance();
  // const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);

  const [pseudonym, setPseudonym] = useState<string>('');
  const [termsChecked, setTermsChecked] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    if (account) {
      const loginMessage = SIGNED_MSG_BASE.replace('%%', new Date().toString());
      walletService.signMessage(loginMessage).then(res =>
        axios
          .post(
            `${notificationUrl}/tradingCompetition/${account.toLowerCase()}`,
            {
              ...(pseudonym.length ? { userName: pseudonym } : {}),
              message: loginMessage,
              signedMessage: res,
            },
          )
          .then(res => {
            console.log('res: ', res);
            if (res.status && res.status === 200) {
              setPseudonym('');
              onClose();
            }
          })
          .catch(e => {
            console.log('e: ', e);
          }),
      );
    } else {
      console.log('NO ACCOUNT');
    }
  }, [onClose, account, pseudonym]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        setPseudonym('');
        onClose();
      }}
      size={DialogSize.md}
    >
      <div className="tw-mx-auto">
        <h1 className="tw-text-sov-white tw-text-center">Enter Competition</h1>

        <FormGroup label="Pseudonym (Optional):" className="tw-mb-6">
          <Input
            value={pseudonym}
            onChange={val => setPseudonym(val)}
            placeholder="Enter Pseudonym"
            className="tw-max-w-full"
          />
        </FormGroup>
        <FormGroup label="Wallet Address:" className="tw-mb-6">
          <DummyField>{account}</DummyField>
        </FormGroup>

        <Checkbox
          checked={termsChecked}
          onChange={() => setTermsChecked(!termsChecked)}
          label={
            "I agree to the Perp Swaps trading competition's terms and condition"
          }
        />
        <DialogButton
          confirmLabel="Confirm"
          onConfirm={onSubmit}
          disabled={!termsChecked || !connected}
        />
      </div>
    </Dialog>
  );
};

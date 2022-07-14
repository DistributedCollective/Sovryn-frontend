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
import { currentChainId, notificationServiceUrl } from 'utils/classifiers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

const SIGNED_MSG_BASE = 'Login to backend on: %%';
const baseUrl = notificationServiceUrl[currentChainId];

interface IRegisterDialogProps {
  isOpen: boolean;
  onClose: (success: boolean) => void;
}

export const RegisterDialog: React.FC<IRegisterDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const account = useAccount();
  const connected = useIsConnected();
  const { t } = useTranslation();

  const [pseudonym, setPseudonym] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);

  const onSubmit = useCallback(() => {
    if (account) {
      const loginMessage = SIGNED_MSG_BASE.replace('%%', new Date().toString());
      walletService.signMessage(loginMessage).then(res =>
        axios
          .post(`${baseUrl}tradingCompetition/${account.toLowerCase()}`, {
            ...(pseudonym.length ? { userName: pseudonym } : {}),
            message: loginMessage,
            signedMessage: res,
          })
          .then(res => {
            if (res.status && res.status === 200) {
              setPseudonym('');
              onClose(true);
            }
          })
          .catch(e => {
            console.error(e);
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
        onClose(false);
      }}
      size={DialogSize.md}
    >
      <div className="tw-mx-auto">
        <h1 className="tw-text-sov-white tw-text-center">
          {t(translations.competitionPage.join.title)}
        </h1>

        <FormGroup
          label={t(translations.competitionPage.join.pseudonym)}
          className="tw-mb-6"
        >
          <Input
            value={pseudonym}
            onChange={setPseudonym}
            placeholder={t(
              translations.competitionPage.join.pseudonymPlaceholder,
            )}
            className="tw-max-w-full"
          />
        </FormGroup>
        <FormGroup
          label={t(translations.competitionPage.join.wallet)}
          className="tw-mb-6"
        >
          <DummyField>{account}</DummyField>
        </FormGroup>

        <Checkbox
          checked={termsChecked}
          onChange={() => setTermsChecked(!termsChecked)}
          label={t(translations.competitionPage.join.conditions)}
        />
        <DialogButton
          confirmLabel={t(translations.competitionPage.join.cta)}
          onConfirm={onSubmit}
          disabled={!termsChecked || !connected}
        />
      </div>
    </Dialog>
  );
};

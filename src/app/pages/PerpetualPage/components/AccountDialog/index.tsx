import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Dialog, DialogSize } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';
import { AccountBalanceForm } from '../AccountBalanceForm';

enum AccountView {
  balance,
  history,
}

type AccountDialogProps = {
  pairType: PerpetualPairType;
};

export const AccountDialog: React.FC<AccountDialogProps> = ({ pairType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modal } = useSelector(selectPerpetualPage);
  const [accountView, setAccountView] = useState<AccountView>(
    AccountView.balance,
  );

  const onClose = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.NONE));
  }, [dispatch]);

  const onOpenTransactionHistory = useCallback(() => {
    setAccountView(AccountView.history);
  }, []);

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.ACCOUNT_BALANCE}
      onClose={onClose}
      size={DialogSize.lg}
    >
      <h1>
        {accountView === AccountView.balance
          ? t(translations.perpetualPage.accountBalance.titleBalance)
          : t(translations.perpetualPage.accountBalance.titleHistory)}
      </h1>
      {accountView === AccountView.balance && (
        <AccountBalanceForm
          pairType={pairType}
          onOpenTransactionHistory={onOpenTransactionHistory}
        />
      )}
      {accountView === AccountView.history && ''}
    </Dialog>
  );
};

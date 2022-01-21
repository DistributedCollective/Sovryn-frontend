import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import iconArrowForward from 'assets/images/arrow_forward.svg';
import { translations } from '../../../../../locales/i18n';
import { Dialog, DialogSize } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';
import { AccountBalanceForm } from '../AccountBalanceForm';
import { AccountFundingHistory } from '../AccountFundingHistory';

enum AccountView {
  balance,
  history,
}

export const AccountDialog: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modal } = useSelector(selectPerpetualPage);
  const [accountView, setAccountView] = useState(AccountView.balance);

  const onClose = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.NONE));
  }, [dispatch]);

  const onOpenFundingHistory = useCallback(() => {
    setAccountView(AccountView.history);
  }, []);

  const onOpenBalance = useCallback(() => {
    setAccountView(AccountView.balance);
  }, []);

  useEffect(() => {
    if (modal !== PerpetualPageModals.ACCOUNT_BALANCE) {
      setAccountView(AccountView.balance);
    }
  }, [modal]);

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.ACCOUNT_BALANCE}
      onClose={onClose}
      size={DialogSize.lg}
    >
      <h1 className="tw-relative">
        {accountView !== AccountView.balance && (
          <button
            className="tw-absolute tw-left-6 tw-top-0 tw-p-2"
            onClick={onOpenBalance}
          >
            <img
              className="tw-transform tw-rotate-180"
              src={iconArrowForward}
              alt="Back"
              title="Back"
            />
          </button>
        )}
        {accountView === AccountView.balance
          ? t(translations.perpetualPage.accountBalance.titleBalance)
          : t(translations.perpetualPage.accountBalance.titleHistory)}
      </h1>
      {accountView === AccountView.balance && (
        <AccountBalanceForm onOpenTransactionHistory={onOpenFundingHistory} />
      )}
      {accountView === AccountView.history && <AccountFundingHistory />}
    </Dialog>
  );
};

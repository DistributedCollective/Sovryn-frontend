import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Dialog, DialogSize } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';

export const AccountBalanceDialog: React.FC = ({}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modal } = useSelector(selectPerpetualPage);

  const onClose = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.NONE));
  }, [dispatch]);

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.ACCOUNT_BALANCE}
      onClose={onClose}
      size={DialogSize.lg}
    >
      <h1>{t(translations.perpetualPage.accountBalance.title)}</h1>
    </Dialog>
  );
};

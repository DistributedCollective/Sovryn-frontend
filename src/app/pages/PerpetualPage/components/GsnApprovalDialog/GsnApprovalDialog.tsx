import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import {
  PerpetualPageModals,
  PERPETUAL_PAYMASTER,
  PERPETUAL_CHAIN,
} from '../../types';
import { toWei } from '../../../../../utils/blockchain/math-helpers';
import { ActionDialogSubmitButton } from '../ActionDialogSubmitButton';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { Asset } from '../../../../../types';
import { useGsnCheckAndApprove } from '../../../../hooks/useGsnCheckAndApprove';
import { TransactionDialog } from '../../../../components/TransactionDialog';
import { CheckAndApproveResult } from '../../../../../utils/sovryn/contract-writer';
import { TxStatus } from '../../../../../store/global/transactions-store/types';

export const GsnApprovalDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal } = useSelector(selectPerpetualPage);
  const { checkAndApprove, ...transaction } = useGsnCheckAndApprove(
    PERPETUAL_CHAIN,
    'PERPETUALS_token',
    PERPETUAL_PAYMASTER,
    false,
    Asset.BTCS,
  );

  const { checkMaintenance, States } = useMaintenance();
  const isInMaintenance = useMemo(
    () => checkMaintenance(States.PERPETUALS, States.PERPETUALS_GSN),
    [checkMaintenance, States],
  );

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  const onSubmit = useCallback(() => {
    checkAndApprove(PERPETUAL_PAYMASTER.toLowerCase(), toWei(999999))
      .then((result: CheckAndApproveResult) => {
        if (result.approveTx && !result.rejected) {
          dispatch(actions.setUseMetaTransactions(true));
          dispatch(actions.setModal(PerpetualPageModals.NONE));
        }
      })
      .catch(console.error);
  }, [checkAndApprove, dispatch]);

  return (
    <>
      <Dialog
        isOpen={
          modal === PerpetualPageModals.GSN_APPROVAL &&
          transaction.status === TxStatus.NONE
        }
        onClose={onClose}
      >
        <div className="tw-mw-340 tw-mx-auto">
          <h1>{t(translations.perpetualPage.gsnDialog.title)}</h1>
          <p>{t(translations.perpetualPage.gsnDialog.explainer)}</p>
          <ActionDialogSubmitButton
            inMaintenance={isInMaintenance}
            onClick={onSubmit}
          >
            {t(translations.perpetualPage.gsnDialog.button)}
          </ActionDialogSubmitButton>
        </div>
      </Dialog>
      {transaction && <TransactionDialog tx={transaction} />}
    </>
  );
};

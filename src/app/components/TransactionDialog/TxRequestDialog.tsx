import React, { useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { detectWeb3Wallet } from 'utils/helpers';

import { actions } from 'store/global/transactions-store/slice';
import { translations } from 'locales/i18n';
import { WalletContext } from '@sovryn/react-wallet';
import txFailed from 'assets/images/failed-tx.svg';
import { Trans } from 'react-i18next';
import { ActionButton } from 'app/components/Form/ActionButton';
import { WalletLogo } from './WalletLogo';
import { getWalletName } from './utils';
import {
  RequestDialogState,
  TxType,
} from 'store/global/transactions-store/types';
import { Dialog } from 'app/containers/Dialog';

export const TxRequestDialog: React.FC<RequestDialogState> = ({
  open,
  type,
  error,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { address } = useContext(WalletContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  const normalizedError = useMemo(() => {
    if (error) {
      if (
        error.includes('User denied transaction signature') ||
        error.includes('UserDeclinedError')
      ) {
        return t(translations.walletProvider.userDenied);
      }
    }
    return error;
  }, [error, t]);

  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => dispatch(actions.closeTransactionRequestDialog())}
        isCloseButtonShown={false}
      >
        {type === TxType.APPROVE && (
          <>
            <h1>
              {t(translations.walletProvider.txRequestDialog.approve.title)}
            </h1>

            <WalletLogo wallet={wallet} />

            {error ? (
              <>
                <img
                  src={txFailed}
                  alt="failed"
                  className="tw-w-8 tw-mx-auto tw-mb-4 tw-opacity-75"
                />
                <div className="tw-text-center tw-px-3 tw-text-warning">
                  <Trans
                    i18nKey={translations.transactionDialog.txStatus.aborted}
                  />
                  {normalizedError && (
                    <div className="tw-mb-8">{normalizedError}</div>
                  )}
                </div>
                <ActionButton
                  onClick={() =>
                    dispatch(actions.closeTransactionRequestDialog())
                  }
                  text={t(
                    translations.walletProvider.txRequestDialog.closeButton,
                  )}
                  className={
                    'tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto'
                  }
                  textClassName="tw-inline-block tw-text-lg"
                />
              </>
            ) : (
              <>
                <p className="tw-text-center tw-mb-0">
                  {t(translations.buySovPage.txDialog.pendingUser.text, {
                    walletName: getWalletName(wallet),
                  })}
                </p>
              </>
            )}
          </>
        )}
      </Dialog>
    </>
  );
};

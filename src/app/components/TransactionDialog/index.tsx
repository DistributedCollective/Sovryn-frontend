import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Dialog } from 'app/containers/Dialog';
import { ResetTxResponseInterface } from '../../hooks/useSendContractTx';
import { TxStatus } from 'store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from 'utils/helpers';
import txFailed from 'assets/images/failed-tx.svg';
import { LinkToExplorer } from '../LinkToExplorer';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { usePrevious } from '../../hooks/usePrevious';
import { ActionButton } from 'app/components/Form/ActionButton';
import classNames from 'classnames';
import { getStatusImage } from './utils';
import { WalletLogo } from './WalletLogo';
import { getWalletName } from '../UserAssets/TxDialog/WalletLogo';
import { WalletContext } from '@sovryn/react-wallet';

interface ITransactionDialogProps {
  tx: ResetTxResponseInterface;
  onUserConfirmed?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  onClose?: () => void;
  action?: string;
  fee?: React.ReactNode;
  finalMessage?: React.ReactNode;
}

export const TransactionDialog: React.FC<ITransactionDialogProps> = ({
  tx,
  onUserConfirmed,
  onSuccess,
  onError,
  onClose,
  action,
  fee,
  finalMessage,
}) => {
  const { t } = useTranslation();
  const { address } = useContext(WalletContext);
  const onCloseHandler = useCallback(() => {
    onClose?.();
    if (tx.status === TxStatus.CONFIRMED) {
      onSuccess?.();
    }
    if (tx.status === TxStatus.FAILED) {
      onError?.();
    }
    tx.reset();
  }, [onClose, tx, onSuccess, onError]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  const oldStatus = usePrevious(tx.status);

  useEffect(() => {
    oldStatus === TxStatus.PENDING_FOR_USER &&
      tx.status === TxStatus.PENDING &&
      onUserConfirmed?.();
  }, [oldStatus, tx.status, onUserConfirmed]);

  return (
    <Dialog
      isOpen={tx.status !== TxStatus.NONE}
      onClose={onCloseHandler}
      dataAttribute="transaction-dialog"
    >
      {tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>
          <WalletLogo wallet={wallet} />
          <p className="tw-text-center tw-mx-auto tw-w-full tw-mt-2 tw-px-6 tw-mb-0">
            {t(translations.transactionDialog.pendingUser.text, {
              walletName: getWalletName(wallet),
            })}
          </p>
        </>
      )}
      {[TxStatus.FAILED].includes(tx.status) && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>
          <WalletLogo wallet={wallet} />
          <img
            src={txFailed}
            alt="failed"
            className="tw-w-8 tw-mx-auto tw-mb-4 tw-opacity-75"
          />
          <p className="tw-text-center tw-text-warning">
            <Trans i18nKey={translations.transactionDialog.txStatus.aborted} />
          </p>
          {wallet === 'ledger' && (
            <p className="tw-text-center tw-text-warning">
              {t(translations.transactionDialog.txStatus.abortedLedger)}
            </p>
          )}
          {tx.retry && (
            <ActionButton
              text={t(translations.transactionDialog.pendingUser.retry)}
              onClick={tx.retry}
              className="tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto"
              textClassName="tw-inline-block tw-text-lg"
            />
          )}
        </>
      )}
      {[TxStatus.PENDING, TxStatus.CONFIRMED].includes(tx.status) && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>

          <div className={'tw-text-center tw-mx-auto tw-w-16 tw-mb-4'}>
            <img
              src={getStatusImage(tx.status)}
              className={classNames('tw-w-16 tw-h-16', {
                'tw-animate-spin': tx.status === TxStatus.PENDING,
              })}
              alt="Status"
            />
          </div>
          <div className="tw-px-8">
            {finalMessage && (
              <div className="tw-w-full tw-rounded-xl tw-bg-gray-2 tw-px-6 tw-py-4 tw-mb-4">
                {finalMessage}
              </div>
            )}

            {tx.txHash && (
              <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
                {fee && <>{fee}</>}
                <div className="tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white tw-items-center">
                  <div className="tw-w-1/2 tw-text-gray-10 tw-text-gray-10">
                    {t(translations.stake.txId)}
                  </div>
                  <div className="tw-font-medium tw-w-1/2 tw-pl-2 tw-text-right">
                    <LinkToExplorer
                      chainId={tx.txData?.chainId}
                      txHash={tx.txHash}
                      text={prettyTx(tx.txHash)}
                      className="tw-text-blue tw-underline"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <ActionButton
            onClick={onCloseHandler}
            text={t(translations.common.close)}
            className="tw-max-w-7xl tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto tw-mt-14"
            textClassName="tw-inline-block tw-text-lg"
            data-action-id="close-transaction-dialog-button"
          />
        </>
      )}
    </Dialog>
  );
};

const getTransactionTitle = (tx: TxStatus, action: string = '') => {
  switch (tx) {
    case TxStatus.FAILED:
      return (
        <Trans
          i18nKey={translations.transactionDialog.pendingUser.failed}
          values={{ action }}
        />
      );
    case TxStatus.PENDING_FOR_USER:
      return (
        <Trans
          i18nKey={translations.transactionDialog.pendingUser.title}
          values={{ action }}
        />
      );
    case TxStatus.PENDING:
      return (
        <Trans
          i18nKey={translations.transactionDialog.txStatus.processing}
          values={{ action }}
        />
      );
    case TxStatus.CONFIRMED:
      return (
        <Trans
          i18nKey={translations.transactionDialog.txStatus.complete}
          values={{ action }}
        />
      );
    default:
      return (
        <Trans
          i18nKey={translations.transactionDialog.txStatus.processing}
          values={{ action }}
        />
      );
  }
};

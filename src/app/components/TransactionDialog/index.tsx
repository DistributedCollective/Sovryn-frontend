import React, { useCallback, useEffect, useMemo } from 'react';
import { Dialog } from '../../containers/Dialog';
import { ResetTxResponseInterface } from '../../hooks/useSendContractTx';
import { TxStatus } from 'store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from 'utils/helpers';
import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import wPortis from 'assets/wallets/portis.svg';
import wLedger from 'assets/wallets/ledger.svg';
import wTrezor from 'assets/wallets/trezor.svg';
import wWalletConnect from 'assets/wallets/walletconnect.svg';
import { LinkToExplorer } from '../LinkToExplorer';
import styles from './dialog.module.scss';
import { useWalletContext } from '@sovryn/react-wallet';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { usePrevious } from '../../hooks/usePrevious';
import { ActionButton } from 'app/components/Form/ActionButton';
import cn from 'classnames';

interface ITransactionDialogProps {
  tx: ResetTxResponseInterface;
  onUserConfirmed?: () => void;
  onSuccess?: () => void;
  action?: string;
  fee?: React.ReactNode;
  finalMessage?: React.ReactNode;
}

export const TransactionDialog: React.FC<ITransactionDialogProps> = ({
  tx,
  onUserConfirmed,
  onSuccess,
  action,
  fee,
  finalMessage,
}) => {
  const { t } = useTranslation();
  const { address } = useWalletContext();

  const close = useCallback(() => tx.reset(), [tx]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  const oldStatus = usePrevious(tx.status);

  useEffect(() => {
    if (
      oldStatus === TxStatus.PENDING_FOR_USER &&
      tx.status === TxStatus.PENDING &&
      onUserConfirmed
    ) {
      onUserConfirmed();
    }
  }, [oldStatus, tx.status, onUserConfirmed]);

  useEffect(() => {
    if (tx.status === TxStatus.CONFIRMED && onSuccess) {
      onSuccess();
    }
  }, [tx.status, onSuccess]);

  return (
    <Dialog
      isCloseButtonShown={true}
      isOpen={tx.status !== TxStatus.NONE}
      onClose={close}
      className={styles.dialog}
    >
      {tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>
          <WalletLogo wallet={wallet} />
          <p className="tw-text-center tw-mx-auto tw-w-full tw-mt-4 tw-px-4">
            {t(translations.transactionDialog.pendingUser.text, {
              walletName: getWalletName(wallet),
            })}
          </p>
        </>
      )}
      {!tx.txHash && tx.status === TxStatus.FAILED && (
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
              className={cn(
                styles.submit,
                'tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto',
              )}
              textClassName="tw-inline-block tw-text-lg"
            />
          )}
        </>
      )}
      {[TxStatus.PENDING, TxStatus.CONFIRMED].includes(tx.status) && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>

          <div className={styles.styledStatus}>
            <img
              src={getStatusImage(tx.status)}
              className={cn({
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
              <div className="tw-w-full tw-rounded-xl tw-bg-gray-2 tw-grid tw-grid-cols-2 tw-px-6 tw-py-4">
                {fee && (
                  <>
                    <span className="tw-text-sm">
                      {t(
                        translations.perpetualPage.tradeForm.labels.tradingFee,
                      )}
                    </span>
                    <span>{fee}</span>
                  </>
                )}
                <span className="tw-text-sm">Tx ID:</span>
                <LinkToExplorer
                  txHash={tx.txHash}
                  text={prettyTx(tx.txHash)}
                  className="tw-text-blue tw-underline"
                />
              </div>
            )}
          </div>

          <ActionButton
            onClick={close}
            text={t(translations.common.close)}
            className={cn(
              styles.submit,
              'tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto tw-mt-16',
            )}
            textClassName="tw-inline-block tw-text-lg"
          />
        </>
      )}
    </Dialog>
  );
};

const getWalletName = wallet => {
  switch (wallet) {
    case 'liquality':
      return 'Liquality';
    case 'nifty':
      return 'Nifty';
    case 'portis':
      return 'Portis';
    case 'ledger':
      return 'Ledger';
    case 'trezor':
      return 'Trezor';
    case 'wallet-connect':
      return 'Wallet Connect';
    default:
      return 'MetaMask';
  }
};

const getWalletImage = wallet => {
  switch (wallet) {
    case 'liquality':
      return wLiquality;
    case 'nifty':
      return wNifty;
    case 'portis':
      return wPortis;
    case 'ledger':
      return wLedger;
    case 'trezor':
      return wTrezor;
    case 'wallet-connect':
      return wWalletConnect;
    default:
      return wMetamask;
  }
};

const getTransactionTitle = (tx: TxStatus, action: string = '') => {
  if (tx === TxStatus.FAILED)
    return (
      <Trans
        i18nKey={translations.transactionDialog.pendingUser.failed}
        values={{ action }}
      />
    );
  if (tx === TxStatus.PENDING_FOR_USER)
    return (
      <Trans
        i18nKey={translations.transactionDialog.pendingUser.title}
        values={{ action }}
      />
    );

  if (tx === TxStatus.PENDING)
    return (
      <Trans i18nKey={translations.transactionDialog.txStatus.processing} />
    );
  if (tx === TxStatus.CONFIRMED)
    return <Trans i18nKey={translations.transactionDialog.txStatus.complete} />;

  return <Trans i18nKey={translations.transactionDialog.txStatus.processing} />;
};

const getStatusImage = (tx: TxStatus) => {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) return txConfirm;
  return txPending;
};

type WalletLogoProps = {
  wallet: string;
};
export const WalletLogo: React.FC<WalletLogoProps> = ({ wallet }) => (
  <div
    className={cn(
      styles.wlContainer,
      'tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden',
    )}
  >
    <img className={styles.wlImage} src={getWalletImage(wallet)} alt="Wallet" />
    <div className="tw-truncate tw-text-sm">{getWalletName(wallet)}</div>
  </div>
);

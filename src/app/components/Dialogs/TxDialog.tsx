import React, { useCallback, useEffect, useMemo, useContext } from 'react';
import { WalletContext } from '@sovryn/react-wallet';
import { Dialog } from '../../containers/Dialog';
import { ResetTxResponseInterface } from '../../hooks/useSendContractTx';
import { TxStatus } from '../../../store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from '../../../utils/helpers';
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
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ConfirmButton } from 'app/pages/BuySovPage/components/Button/confirm';
import { usePrevious } from '../../hooks/usePrevious';
import classNames from 'classnames';
import styles from './TxDialog.module.scss';

type ITxDialogProps = {
  tx: ResetTxResponseInterface;
  onUserConfirmed?: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
};

export const TxDialog: React.FC<ITxDialogProps> = ({
  tx,
  onUserConfirmed,
  onSuccess,
  onClose,
}) => {
  const { t } = useTranslation();
  const { address } = useContext(WalletContext);

  const close = useCallback(() => {
    tx.reset();
    if (onClose) {
      onClose();
    }
  }, [tx, onClose]);

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
      isCloseButtonShown={false}
      isOpen={tx.status !== TxStatus.NONE}
      onClose={close}
    >
      {tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h1>{t(translations.buySovPage.txDialog.pendingUser.title)}</h1>
          <WalletLogo wallet={wallet} />
          <p
            className="tw-text-center tw-mx-auto tw-w-full"
            style={{ maxWidth: 266 }}
          >
            {t(translations.buySovPage.txDialog.pendingUser.text, {
              walletName: getWalletName(wallet),
            })}
          </p>
        </>
      )}
      {[TxStatus.PENDING, TxStatus.CONFIRMED, TxStatus.FAILED].includes(
        tx.status,
      ) && (
        <>
          <button data-close="" className="dialog-close" onClick={close}>
            <span className="tw-sr-only">Close Dialog</span>
          </button>
          <h1>{t(translations.buySovPage.txDialog.txStatus.title)}</h1>
          <TxStatusIcon status={tx.status} showLabel />

          {!!tx.txHash && (
            <div className={styles.hashContainer}>
              <div className="tw-mb-9 tw-text-center tw-font-sm tw-font-light">
                <strong className="tw-inline-block tw-mr-3.5 tw-font-medium">
                  Hash:
                </strong>
                {prettyTx(tx.txHash)}
              </div>
              <div className="tw-text-center">
                <LinkToExplorer
                  className="tw-text-blue tw-font-medium tw-underline hover:tw-no-underline"
                  txHash={tx.txHash}
                  text={t(translations.buySovPage.txDialog.txStatus.cta)}
                />
              </div>
            </div>
          )}

          {!tx.txHash && tx.status === TxStatus.FAILED && (
            <>
              <p className="tw-text-center">
                {t(translations.buySovPage.txDialog.txStatus.aborted)}
              </p>
              {wallet === 'ledger' && (
                <p className="tw-text-center">
                  {t(translations.buySovPage.txDialog.txStatus.abortedLedger)}
                </p>
              )}
            </>
          )}

          <div style={{ maxWidth: 200 }} className="tw-mx-auto tw-w-full">
            <ConfirmButton
              onClick={close}
              text={t(translations.common.close)}
            />
          </div>
        </>
      )}
    </Dialog>
  );
};

function getWalletName(wallet) {
  if (wallet === 'liquality') return 'Liquality';
  if (wallet === 'nifty') return 'Nifty';
  if (wallet === 'portis') return 'Portis';
  if (wallet === 'ledger') return 'Ledger';
  if (wallet === 'trezor') return 'Trezor';
  if (wallet === 'wallet-connect') return 'Wallet Connect';
  return 'MetaMask';
}

function getWalletImage(wallet) {
  if (wallet === 'liquality') return wLiquality;
  if (wallet === 'nifty') return wNifty;
  if (wallet === 'portis') return wPortis;
  if (wallet === 'ledger') return wLedger;
  if (wallet === 'trezor') return wTrezor;
  if (wallet === 'wallet-connect') return wWalletConnect;
  return wMetamask;
}

function getStatusImage(tx: TxStatus) {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) return txConfirm;
  return txPending;
}

function getStatus(tx: TxStatus) {
  if (tx === TxStatus.FAILED)
    return <Trans i18nKey={translations.common.failed} />;
  if (tx === TxStatus.CONFIRMED)
    return <Trans i18nKey={translations.common.confirmed} />;
  return <Trans i18nKey={translations.common.pending} />;
}

type TxStatusIconProps = {
  status: TxStatus;
  className?: string;
  isInline?: boolean;
  showLabel?: boolean;
};

export const TxStatusIcon: React.FC<TxStatusIconProps> = ({
  status,
  className,
  isInline,
  showLabel,
}) => (
  <div
    className={classNames(
      isInline
        ? 'tw-inline-flex tw-flex-row tw-max-h-full'
        : 'tw-w-24 tw-mx-auto tw-mb-8 tw-text-center',
      className,
    )}
  >
    <img
      src={getStatusImage(status)}
      className={classNames(
        isInline ? 'tw-h-auto flex-initial' : 'tw-h-24 tw-w-24',
        isInline && showLabel && 'tw-mr-2',
        status === 'pending' && 'tw-animate-spin',
      )}
      alt="Status"
    />
    {showLabel && (
      <p className={!isInline ? 'tw-text-base tw-font-medium' : ''}>
        {getStatus(status)}
      </p>
    )}
  </div>
);

function WalletLogo({ wallet }: { wallet: string }) {
  return (
    <div className={styles.wlContainer}>
      <img
        className={styles.wlImage}
        src={getWalletImage(wallet)}
        alt="Wallet"
      />
      <div className="tw-text-xs tw-truncate">{getWalletName(wallet)}</div>
    </div>
  );
}

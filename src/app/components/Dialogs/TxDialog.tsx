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
import styles from './dialog.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ConfirmButton } from 'app/pages/BuySovPage/components/Button/confirm';
import { usePrevious } from '../../hooks/usePrevious';
import classNames from 'classnames';

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
      className={classNames('tw-m-3.5', styles.dialog)}
    >
      {tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h1>{t(translations.buySovPage.txDialog.pendingUser.title)}</h1>
          <WalletLogo wallet={wallet} />
          <p className="tw-text-center tw-mx-auto tw-w-full tw-max-w-xs">
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
          <StatusComponent status={tx.status} />

          {!!tx.txHash && (
            <div className="tw-max-w-xs tw-w-full">
              <div className="tw-text-center tw-text-sm tw-font-light tw-mb-9">
                <strong className="tw-font-medium tw-mr-3.5 tw-inline-block">
                  Hash:
                </strong>{' '}
                {prettyTx(tx.txHash)}
              </div>
              <div className="tw-text-secondary tw-text-center">
                <LinkToExplorer
                  txHash={tx.txHash}
                  text={t(translations.buySovPage.txDialog.txStatus.cta)}
                  className="tw-text-blue tw-font-medium tw-underline hover:tw-no-underline"
                />
              </div>
            </div>
          )}

          {!tx.txHash && tx.status === TxStatus.FAILED && (
            <>
              <p className="tw-text-center tw-px-3 tw-text-warning">
                {t(translations.buySovPage.txDialog.txStatus.aborted)}
              </p>
              {wallet === 'ledger' && (
                <p className="tw-text-center tw-px-3 tw-text-warning">
                  {t(translations.buySovPage.txDialog.txStatus.abortedLedger)}
                </p>
              )}
            </>
          )}

          <div className="tw-mx-auto tw-w-full tw-mw-340 tw-mt-10">
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

function getWalletName(wallet: string) {
  if (wallet === 'liquality') return 'Liquality';
  if (wallet === 'nifty') return 'Nifty';
  if (wallet === 'portis') return 'Portis';
  if (wallet === 'ledger') return 'Ledger';
  if (wallet === 'trezor') return 'Trezor';
  if (wallet === 'wallet-connect') return 'Wallet Connect';
  return 'MetaMask';
}

function getWalletImage(wallet: string) {
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

type StatusComponentProps = {
  status: TxStatus;
  onlyImage?: boolean;
};

export const StatusComponent: React.FC<StatusComponentProps> = ({
  status,
  onlyImage = false,
}) => {
  return (
    <div className="tw-mx-auto tw-text-center tw-w-24">
      <img
        src={getStatusImage(status)}
        className={`${
          status === 'pending' && 'tw-animate-spin'
        } tw-w-14 tw-h-14 tw-mx-auto`}
        alt="Status"
      />
      {!onlyImage && (
        <p className="tw-text-base tw-font-medium">{getStatus(status)}</p>
      )}
    </div>
  );
};

function WalletLogo({ wallet }: { wallet: string }) {
  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden tw-rounded-2xl tw-border tw-border-sov-white tw-w-24 tw-h-24 tw-mx-auto tw-mb-9">
      <img
        className="tw-w-12 tw-h-12 tw-mb-2.5 tw-object-contain"
        src={getWalletImage(wallet)}
        alt="Wallet"
      />
      <div className="tw-truncate tw-text-xs">{getWalletName(wallet)}</div>
    </div>
  );
}

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
import styled from 'styled-components/macro';
import styles from './dialog.module.scss';
import { useWalletContext } from '@sovryn/react-wallet';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { usePrevious } from '../../hooks/usePrevious';
import { ActionButton } from 'app/components/Form/ActionButton';

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
          <p
            className="tw-text-center tw-mx-auto tw-w-full tw-mt-4"
            style={{ maxWidth: 266 }}
          >
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
              className={
                styles.submit +
                ' tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto'
              }
              textClassName="tw-inline-block tw-text-lg"
            />
          )}
        </>
      )}
      {[TxStatus.PENDING, TxStatus.CONFIRMED].includes(tx.status) && (
        <>
          <button data-close="" className="dialog-close" onClick={close}>
            <span className="tw-sr-only">Close Dialog</span>
          </button>
          <h1>{getTransactionTitle(tx.status, action)}</h1>

          <StyledStatus>
            <img
              src={getStatusImage(tx.status)}
              className={`${
                tx.status === TxStatus.PENDING && 'tw-animate-spin'
              }`}
              alt="Status"
            />
          </StyledStatus>
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
                    <span className="tw-text-sm">Trading Fee:</span>
                    <span>{fee}</span>
                  </>
                )}
                <span className="tw-text-sm">Tx ID:</span>
                <LinkToExplorer
                  txHash={tx.txHash}
                  text={prettyTx(tx.txHash || '213213')}
                  className="tw-text-blue tw-underline"
                />
              </div>
            )}
          </div>

          <ActionButton
            onClick={close}
            text={t(translations.common.close)}
            className={
              styles.submit +
              ' tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto tw-mt-16'
            }
            textClassName="tw-inline-block tw-text-lg"
          />
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

function getTransactionTitle(tx: TxStatus, action: string = '') {
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
}

function getStatusImage(tx: TxStatus) {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) return txConfirm;
  return txPending;
}

const StyledStatus = styled.div`
  width: 4rem;
  margin: 0 auto 1rem;
  text-align: center;
  img {
    width: 4rem;
    height: 4rem;
  }
`;

const WLContainer = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 1.25rem;
  border: 1px solid #e8e8e8;
  margin: 0 auto 1rem;
  div {
    font-size: 0.75rem;
  }
`;
const WLImage = styled.img`
  width: 85px;
  height: 85px;
  margin-bottom: 10px;
  object-fit: contain;
`;

function WalletLogo({ wallet }: { wallet: string }) {
  return (
    <WLContainer className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden">
      <WLImage src={getWalletImage(wallet)} alt="Wallet" />
      <div className="tw-truncate tw-text-sm">{getWalletName(wallet)}</div>
    </WLContainer>
  );
}

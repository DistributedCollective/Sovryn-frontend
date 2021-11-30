import React, { useCallback, useEffect, useMemo } from 'react';
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
import styled from 'styled-components/macro';
import { useWalletContext } from '@sovryn/react-wallet';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ConfirmButton } from 'app/pages/BuySovPage/components/Button/confirm';
import { usePrevious } from '../../hooks/usePrevious';
import classNames from 'classnames';

interface Props {
  tx: ResetTxResponseInterface;
  onUserConfirmed?: () => void;
  onSuccess?: () => void;
}

export function TxDialog({ tx, onUserConfirmed, onSuccess }: Props) {
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
            <StyledHashContainer>
              <StyledHash>
                <strong>Hash:</strong> {prettyTx(tx.txHash)}
              </StyledHash>
              <ExplorerLink>
                <LinkToExplorer
                  txHash={tx.txHash}
                  text={t(translations.buySovPage.txDialog.txStatus.cta)}
                  className="tw-text-blue"
                />
              </ExplorerLink>
            </StyledHashContainer>
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
}

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

const StyledHashContainer = styled.div`
  max-width: 215px;
  width: 100%;
  margin: 0 auto;
`;

const StyledHash = styled.div`
  text-align: center;
  font-size: 0.875rem;
  font-weight: 300;
  margin-bottom: 35px;
  strong {
    font-weight: 500;
    margin-right: 14px;
    display: inline-block;
  }
`;

const ExplorerLink = styled.div.attrs(_ => ({
  className: 'tw-text-secondary',
}))`
  text-align: center;
  a {
    text-decoration: underline !important;
    font-weight: 500 !important;
    &:hover {
      text-decoration: none !important;
    }
  }
`;

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

const WLContainer = styled.div`
  width: 98px;
  height: 98px;
  border-radius: 1.25rem;
  border: 1px solid #e8e8e8;
  margin: 0 auto 35px;
  div {
    font-size: 0.75rem;
  }
`;
const WLImage = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  object-fit: contain;
`;

function WalletLogo({ wallet }: { wallet: string }) {
  return (
    <WLContainer className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden">
      <WLImage src={getWalletImage(wallet)} alt="Wallet" />
      <div className="tw-truncate">{getWalletName(wallet)}</div>
    </WLContainer>
  );
}

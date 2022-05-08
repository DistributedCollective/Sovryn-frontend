import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Dialog } from '../../../../../containers/Dialog';
import { ResetTxResponseInterface } from '../../../../../hooks/useSendContractTx';
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
import { LinkToExplorer } from '../../../../../components/LinkToExplorer';
import styled from 'styled-components/macro';
import styles from './dialog.module.scss';
import { ConfirmButton } from '../../Button/confirm';
import { WalletContext } from '@sovryn/react-wallet';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  tx: ResetTxResponseInterface;
}

export function TxDialog(props: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { address } = useContext(WalletContext);
  const close = () => {
    props.tx && props.tx.reset();
  };
  const confirm = () => {
    props.tx.reset();
    history.push('/wallet');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={props.tx.status !== TxStatus.NONE}
      onClose={() => close()}
      className={styles.dialog}
    >
      {props.tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h2 className="tw-mb-10 tw-text-3xl tw-leading-tight tw-font-semibold tw-text-center tw-normal-case">
            {t(translations.buySovPage.txDialog.pendingUser.title)}
          </h2>
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
        props.tx.status,
      ) && (
        <>
          <button
            data-close=""
            className="dialog-close"
            onClick={() => close()}
          >
            <span className="tw-sr-only">Close Dialog</span>
          </button>
          <h2 className="tw-mb-10 tw-text-3xl tw-leading-tight tw-font-semibold tw-text-center tw-normal-case">
            {t(translations.buySovPage.txDialog.txStatus.title)}
          </h2>
          <StatusComponent status={props.tx.status} />

          {!!props.tx.txHash && (
            <StyledHashContainer>
              <StyledHash>
                <strong>Hash:</strong> {prettyTx(props.tx.txHash)}
              </StyledHash>
              <ExplorerLink>
                <LinkToExplorer
                  txHash={props.tx.txHash}
                  text={t(translations.buySovPage.txDialog.txStatus.cta)}
                  className="tw-text-blue"
                />
              </ExplorerLink>
            </StyledHashContainer>
          )}

          {!props.tx.txHash && props.tx.status === TxStatus.FAILED && (
            <>
              <p className="tw-text-center tw-px-3 tw-text-warning">
                {t(translations.buySovPage.txDialog.txStatus.aborted)}
              </p>
            </>
          )}

          <div className="tw-mx-auto tw-w-full tw-mw-340">
            <ConfirmButton
              onClick={() =>
                props.tx.status === TxStatus.CONFIRMED ? confirm() : close()
              }
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

const StyledStatus = styled.div`
  width: 100px;
  margin: 0 auto;
  text-align: center;
  img {
    width: 65px;
    height: 65px;
    margin: 0 auto;
  }
  p {
    font-size: 1rem;
    font-weight: 500;
  }
`;

const StyledHashContainer = styled.div`
  max-width: 215px;
  width: 100%;
  margin: 0 auto;
`;

const StyledHash = styled.div`
  text-align: center;
  font-size: 0.875rem;
  font-weight: 400;
  margin-bottom: 35px;
  strong {
    font-weight: 500;
    margin-right: 14px;
    display: inline-block;
  }
`;

const ExplorerLink = styled.div`
  text-align: center;
  a {
    color: #2a8fcc !important;
    text-decoration: underline !important;
    font-weight: 500 !important;
    &:hover {
      color: #2a8fcc !important;
      text-decoration: none !important;
    }
  }
`;

function StatusComponent({ status }: { status: TxStatus }) {
  return (
    <StyledStatus>
      <img
        src={getStatusImage(status)}
        className={classNames(status === TxStatus.PENDING && 'tw-animate-spin')}
        alt="Status"
      />
      <p>{getStatus(status)}</p>
    </StyledStatus>
  );
}

function WalletLogo({ wallet }: { wallet: string }) {
  return (
    <div className="tw-mx-auto tw-mb-8 tw-border-sov-white tw-border tw-rounded-2xl tw-w-24 tw-h-24 tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden">
      <img
        className="tw-w-14 tw-h-14 tw-mb-2.5 tw-object-contain"
        src={getWalletImage(wallet)}
        alt="Wallet"
      />
      <div className="tw-whitespace-nowrap tw-truncate tw-text-sm">
        {getWalletName(wallet)}
      </div>
    </div>
  );
}

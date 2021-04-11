import React from 'react';
import { Dialog } from '../../../../../containers/Dialog';
import { ResetTxResponseInterface } from '../../../../../hooks/useSendContractTx';
import { TxStatus } from '../../../../../../store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from '../../../../../../utils/helpers';
import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import { LinkToExplorer } from '../../../../../components/LinkToExplorer';
import styled from 'styled-components/macro';
import styles from './dialog.module.css';
import { ConfirmButton } from '../../Button/confirm';

const wallet = detectWeb3Wallet();

interface Props {
  tx: ResetTxResponseInterface;
}

export function TxDialog(props: Props) {
  const close = () => {
    props.tx && props.tx.reset();
  };

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={props.tx.status !== TxStatus.NONE}
      onClose={() => close()}
      className={styles.dialog}
    >
      {props.tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h1>Confirm Transaction</h1>
          <WalletLogo wallet={wallet} />
          <p className="text-center mx-auto w-100" style={{ maxWidth: 266 }}>
            Please confirm the transaction in your {getWalletName(wallet)}{' '}
            wallet
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
            <span className="sr-only">Close Dialog</span>
          </button>
          <h1>Transaction Status</h1>
          <StatusComponent status={props.tx.status} />

          {!!props.tx.txHash && (
            <StyledHashContainer>
              <StyledHash>
                <strong>Hash:</strong> {prettyTx(props.tx.txHash)}
              </StyledHash>
              <ExplorerLink>
                <LinkToExplorer
                  txHash={props.tx.txHash}
                  text="View in Tracker"
                  className="text-blue"
                />
              </ExplorerLink>
            </StyledHashContainer>
          )}

          {!props.tx.txHash && props.tx.status === TxStatus.FAILED && (
            <>
              <p className="text-center">Transaction was aborted by user.</p>
            </>
          )}

          <div style={{ maxWidth: 200 }} className="mx-auto w-100">
            <ConfirmButton onClick={() => close()} text="Close" />
          </div>
        </>
      )}
    </Dialog>
  );
}

function getWalletName(wallet) {
  if (wallet === 'liquality') return 'Liquality';
  if (wallet === 'nifty') return 'Nifty';
  return 'MetaMask';
}

function getWalletImage(wallet) {
  if (wallet === 'liquality') return wLiquality;
  if (wallet === 'nifty') return wNifty;
  return wMetamask;
}

function getStatusImage(tx: TxStatus) {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) return txConfirm;
  return txPending;
}

function getStatus(tx: TxStatus) {
  if (tx === TxStatus.FAILED) return 'Failed';
  if (tx === TxStatus.CONFIRMED) return 'Confirmed';
  return 'Pending';
}

const StyledStatus = styled.div`
  width: 100px;
  margin: 0 auto 35px;
  text-align: center;
  img {
    width: 100px;
    height: 100px;
  }
  p {
    font-size: 16px;
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
  font-size: 14px;
  font-weight: 300;
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
    color: #2274a5 !important;
    text-decoration: underline !important;
    font-weight: 500 !important;
    &:hover {
      color: ##2274a5 !important;
      text-decoration: none !important;
    }
  }
`;

function StatusComponent({ status }: { status: TxStatus }) {
  return (
    <StyledStatus>
      <img src={getStatusImage(status)} alt="Status" />
      <p>{getStatus(status)}</p>
    </StyledStatus>
  );
}

const WLContainer = styled.div`
  width: 98px;
  height: 98px;
  border-radius: 20px;
  border: 1px solid #e9eae9;
  margin: 0 auto 35px;
  div {
    font-size: 12px;
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
    <WLContainer className="d-flex flex-column justify-content-center align-items-center">
      <WLImage src={getWalletImage(wallet)} alt="Wallet" />
      <div>{getWalletName(wallet)}</div>
    </WLContainer>
  );
}

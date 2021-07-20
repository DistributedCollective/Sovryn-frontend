import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../Dialog/Loadable';
import { detectWeb3Wallet } from 'utils/helpers';
import {
  RequestDialogState,
  TxType,
} from '../../../../store/global/transactions-store/types';
import { actions } from 'store/global/transactions-store/slice';
import { translations } from '../../../../locales/i18n';
import { TradeButton } from '../../../components/TradeButton';
import styles from './dialog.module.css';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import wPortis from 'assets/wallets/portis.svg';
import wLedger from 'assets/wallets/ledger.svg';
import wTrezor from 'assets/wallets/trezor.svg';
import wWalletConnect from 'assets/wallets/walletconnect.svg';
import styled from 'styled-components/macro';
import { useWalletContext } from '@sovryn/react-wallet';

interface Props extends RequestDialogState {}

export function TxRequestDialog({ open, type, amount, asset, error }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { address } = useWalletContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);
  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => dispatch(actions.closeTransactionRequestDialog())}
        isCloseButtonShown={false}
        className={styles.dialog}
      >
        {type === TxType.APPROVE && (
          <>
            <h1>
              {t(translations.walletProvider.txRequestDialog.approve.title)}
            </h1>
            {error ? (
              <>
                <p>
                  {t(translations.walletProvider.txRequestDialog.approve.error)}
                </p>
                <div className="alert alert-warning">{error}</div>
                <TradeButton
                  text={t(
                    translations.walletProvider.txRequestDialog.closeButton,
                  )}
                  onClick={() =>
                    dispatch(actions.closeTransactionRequestDialog())
                  }
                />
              </>
            ) : (
              <>
                <WalletLogo wallet={wallet} />
                <p>
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

function WalletLogo({ wallet }: { wallet: string }) {
  return (
    <WLContainer className="tw-flex tw-flex-column tw-justify-center tw-items-center tw-overflow-hidden">
      <WLImage src={getWalletImage(wallet)} alt="Wallet" />
      <div className="tw-whitespace-nowrap tw-truncate">
        {getWalletName(wallet)}
      </div>
    </WLContainer>
  );
}

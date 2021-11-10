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
import styles from './dialog.module.scss';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import wPortis from 'assets/wallets/portis.svg';
import wLedger from 'assets/wallets/ledger.svg';
import wTrezor from 'assets/wallets/trezor.svg';
import wWalletConnect from 'assets/wallets/walletconnect.svg';
import styled from 'styled-components/macro';
import { useWalletContext } from '@sovryn/react-wallet';
import txFailed from 'assets/images/failed-tx.svg';
import { Trans } from 'react-i18next';
import { ActionButton } from 'app/components/Form/ActionButton';

interface Props extends RequestDialogState {}

export const TxRequestDialog: React.FC<Props> = ({ open, type, error }) => {
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

            <WalletLogo wallet={wallet} />

            {error ? (
              <>
                <img
                  src={txFailed}
                  alt="failed"
                  className="tw-w-8 tw-mx-auto tw-mb-4 tw-opacity-75"
                />
                <p className="tw-text-center tw-text-warning">
                  <Trans
                    i18nKey={translations.transactionDialog.txStatus.aborted}
                  />
                  <div>{error}</div>
                </p>
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
};

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
    <WLContainer className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden">
      <WLImage src={getWalletImage(wallet)} alt="Wallet" />
      <div className="tw-whitespace-nowrap tw-truncate">
        {getWalletName(wallet)}
      </div>
    </WLContainer>
  );
}

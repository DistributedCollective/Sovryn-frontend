import { TxStatus } from 'store/global/transactions-store/types';

import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import wPortis from 'assets/wallets/portis.svg';
import wLedger from 'assets/wallets/ledger.svg';
import wTrezor from 'assets/wallets/trezor.svg';

export const getWalletName = wallet => {
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
    default:
      return 'MetaMask';
  }
};

export const getWalletImage = wallet => {
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
    default:
      return wMetamask;
  }
};

export const getStatusImage = (tx: TxStatus) => {
  switch (tx) {
    case TxStatus.FAILED:
      return txFailed;
    case TxStatus.CONFIRMED:
      return txConfirm;
    default:
      return txPending;
  }
};

import React from 'react';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import wPortis from 'assets/wallets/portis.svg';
import wLedger from 'assets/wallets/ledger.svg';
import wTrezor from 'assets/wallets/trezor.svg';
import classNames from 'classnames';

export const getWalletImage = wallet => {
  if (wallet === 'liquality') return wLiquality;
  if (wallet === 'nifty') return wNifty;
  if (wallet === 'portis') return wPortis;
  if (wallet === 'ledger') return wLedger;
  if (wallet === 'trezor') return wTrezor;
  return wMetamask;
};

export const getWalletName = wallet => {
  if (wallet === 'liquality') return 'Liquality';
  if (wallet === 'nifty') return 'Nifty';
  if (wallet === 'portis') return 'Portis';
  if (wallet === 'ledger') return 'Ledger';
  if (wallet === 'trezor') return 'Trezor';
  return 'MetaMask';
};

type WalletLogoProps = {
  wallet: string;
  className?: string;
};

export const WalletLogo: React.FC<WalletLogoProps> = ({
  wallet,
  className,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-justify-between tw-items-center tw-w-40 tw-h-40 tw-mx-auto tw-border-solid tw-border-sov-white tw-rounded-3xl tw-overflow-hidden tw-border-6 tw-mb-16 tw-p-8',
      className,
    )}
  >
    <img className="tw-w-full" src={getWalletImage(wallet)} alt="Wallet" />
    <div className="tw-text-sm tw-truncate">{getWalletName(wallet)}</div>
  </div>
);

import React from 'react';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import wPortis from 'assets/wallets/portis.svg';
import wLedger from 'assets/wallets/ledger.svg';
import wTrezor from 'assets/wallets/trezor.svg';
import wWalletConnect from 'assets/wallets/walletconnect.svg';
import { WLContainer, WLImage } from './styled';

const getWalletImage = wallet => {
  if (wallet === 'liquality') return wLiquality;
  if (wallet === 'nifty') return wNifty;
  if (wallet === 'portis') return wPortis;
  if (wallet === 'ledger') return wLedger;
  if (wallet === 'trezor') return wTrezor;
  if (wallet === 'wallet-connect') return wWalletConnect;
  return wMetamask;
};

export const getWalletName = wallet => {
  if (wallet === 'liquality') return 'Liquality';
  if (wallet === 'nifty') return 'Nifty';
  if (wallet === 'portis') return 'Portis';
  if (wallet === 'ledger') return 'Ledger';
  if (wallet === 'trezor') return 'Trezor';
  if (wallet === 'wallet-connect') return 'Wallet Connect';
  return 'MetaMask';
};

interface IWalletLogoProps {
  wallet: string;
}

export const WalletLogo: React.FC<IWalletLogoProps> = ({ wallet }) => (
  <WLContainer className="d-flex flex-column justify-content-center align-items-center overflow-hidden">
    <WLImage src={getWalletImage(wallet)} alt="Wallet" />
    <div className="text-nowrap text-truncate">{getWalletName(wallet)}</div>
  </WLContainer>
);

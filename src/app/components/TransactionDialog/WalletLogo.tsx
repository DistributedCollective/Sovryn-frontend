import React from 'react';

import { getWalletImage, getWalletName } from './utils';
import styles from './dialog.module.scss';

type WalletLogoProps = {
  wallet: string;
};

export const WalletLogo: React.FC<WalletLogoProps> = ({ wallet }) => (
  <div className="tw-rounded-3xl tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden tw-border tw-border-solid tw-border-sov-white tw-mx-auto tw-mb-4 tw-w-40 tw-h-40">
    <img className={styles.wlImage} src={getWalletImage(wallet)} alt="Wallet" />
    <div className="tw-truncate tw-text-sm">{getWalletName(wallet)}</div>
  </div>
);

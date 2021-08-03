import React, { useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isWeb3Wallet } from '@sovryn/wallet';
import { WalletContext } from '@sovryn/react-wallet';
import { translations } from 'locales/i18n';

import { currentChainId } from '../../../utils/classifiers';
import { detectWeb3Wallet } from '../../../utils/helpers';
import { NetworkDialog } from '../NetworkDialog';
import { DetectionScreen } from './component/DetectionScreen';
import { TutorialScreen } from './component/TutorialScreen';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';

import styles from './NetworkRibbon.module.scss';

export function NetworkRibbon(this: any) {
  const { bridgeChainId } = useSelector(selectWalletProvider);
  const { connected, wallet } = useContext(WalletContext);
  const location = useLocation();
  const walletName = detectWeb3Wallet();
  const { t } = useTranslation();

  const isOpen = useMemo(() => {
    if (bridgeChainId !== null || location.pathname.startsWith('/cross-chain'))
      return false;
    return (
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      wallet.chainId !== currentChainId
    );
  }, [
    bridgeChainId,
    location.pathname,
    connected,
    wallet.providerType,
    wallet.chainId,
  ]);

  const [startTut, setStart] = useState(false);

  const handleTutDialog = () => {
    setStart(true);
  };
  const handleBack = () => {
    setStart(false);
  };
  return (
    <NetworkDialog isOpen={isOpen} className="tw-font-bold" size="normal">
      <div className="tw-py-2 tw-font-body">
        <div className={classNames(styles.title, 'tw-text-center')}>
          {t(translations.wrongNetworkDialog.title)}{' '}
        </div>
      </div>
      {!startTut ? (
        <DetectionScreen onStart={handleTutDialog} walletType={walletName} />
      ) : (
        <TutorialScreen walletType={walletName} onBack={handleBack} />
      )}
    </NetworkDialog>
  );
}

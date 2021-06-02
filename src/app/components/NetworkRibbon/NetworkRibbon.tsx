/* eslint-disable jsx-a11y/anchor-is-valid */
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { translations } from 'locales/i18n';

import { currentChainId } from '../../../utils/classifiers';
import { detectWeb3Wallet } from '../../../utils/helpers';
import { NetworkDialog } from '../NetworkDialog';
import { DetectionScreen } from './component/DetectionScreen';
import { TutorialScreen } from './component/TutorialScreen';

import './_networkRibbon.scss';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';

export function NetworkRibbon(this: any) {
  const { bridgeChainId } = useSelector(selectWalletProvider);
  const { connected, wallet } = useWalletContext();
  const walletName = detectWeb3Wallet();
  const { t } = useTranslation();

  const isOpen = useMemo(() => {
    if (bridgeChainId !== null) return false;
    return (
      connected &&
      web3Wallets.includes(wallet.providerType) &&
      wallet.chainId !== currentChainId
    );
  }, [bridgeChainId, connected, wallet.providerType, wallet.chainId]);

  const [startTut, setStart] = useState(false);

  const handleTutDialog = () => {
    setStart(true);
  };
  const handleBack = () => {
    setStart(false);
  };
  return (
    <NetworkDialog isOpen={isOpen} className="fw-700" size="normal">
      <div className="py-2 font-family-montserrat">
        <div className="text-center title">
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

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { useDetectWeb3ChainId } from 'app/hooks/useDetectWeb3ChainId';

export function NetworkRibbon(this: any) {
  const { bridgeChainId } = useSelector(selectWalletProvider);
  const { connected, wallet, expectedChainId } = useContext(WalletContext);
  const location = useLocation();
  const walletName = detectWeb3Wallet();
  const { t } = useTranslation();

  const web3ChainId = useDetectWeb3ChainId(bridgeChainId || expectedChainId!);

  const isOpen = useMemo(() => {
    if (bridgeChainId !== null || location.pathname.startsWith('/cross-chain'))
      return false;
    return (
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      web3ChainId !== currentChainId
    );
  }, [
    bridgeChainId,
    location.pathname,
    connected,
    web3ChainId,
    wallet.providerType,
  ]);

  const [startTut, setStart] = useState(false);

  const handleTutDialog = useCallback(() => setStart(true), []);
  const handleBack = useCallback(() => setStart(false), []);

  return (
    <NetworkDialog isOpen={isOpen} className="tw-font-bold" size="normal">
      <div className="tw-py-2 tw-font-body">
        <div className="tw-font-semibold tw-text-2xl tw-leading-none tw-normal-case tw-text-center">
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

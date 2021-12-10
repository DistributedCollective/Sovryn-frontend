import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isWeb3Wallet } from '@sovryn/wallet';
import { WalletContext } from '@sovryn/react-wallet';
import { translations } from 'locales/i18n';

import { currentChainId } from '../../../utils/classifiers';
import { detectWeb3Wallet, capitalize } from '../../../utils/helpers';
import { NetworkDialog } from '../NetworkDialog';
import { DetectionScreen } from './component/DetectionScreen';
import { TutorialScreen } from './component/TutorialScreen';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import networksRaw from './network.json';
import { Network } from './types';

const networks: Network[] = networksRaw;

export function NetworkRibbon(this: any) {
  const { bridgeChainId } = useSelector(selectWalletProvider);
  const { connected, wallet } = useContext(WalletContext);
  const location = useLocation();
  const walletName = detectWeb3Wallet();
  const { t } = useTranslation();

  const isOpen = useMemo(() => {
    console.log('bridgeChainId: ', bridgeChainId);
    console.log('currentChainId: ', currentChainId);
    console.log('wallet.chainId: ', wallet.chainId);
    if (
      !connected ||
      !isWeb3Wallet(wallet.providerType!) ||
      location.pathname.startsWith('/cross-chain')
    )
      return false;

    if (bridgeChainId) return wallet.chainId !== bridgeChainId;

    return wallet.chainId !== currentChainId;
  }, [
    bridgeChainId,
    location.pathname,
    connected,
    wallet.providerType,
    wallet.chainId,
  ]);

  const targetNetwork = useMemo(() => {
    return networks.find(
      item => item.chainId === (bridgeChainId || currentChainId),
    );
  }, [bridgeChainId]);

  const [startTut, setStart] = useState(false);

  const handleTutDialog = useCallback(() => setStart(true), []);
  const handleBack = useCallback(() => setStart(false), []);

  return (
    <NetworkDialog isOpen={isOpen} className="tw-font-bold" size="normal">
      <div className="tw-py-2 tw-font-body">
        <div className="tw-font-semibold tw-text-2xl tw-leading-none tw-normal-case tw-text-center">
          {t(translations.wrongNetworkDialog.title, {
            name: `${targetNetwork?.chain} ${capitalize(
              targetNetwork?.network || '',
            )}`,
          })}
        </div>
      </div>
      {!startTut ? (
        <DetectionScreen
          onStart={handleTutDialog}
          walletType={walletName}
          network={targetNetwork}
        />
      ) : (
        <TutorialScreen
          walletType={walletName}
          network={targetNetwork}
          onBack={handleBack}
        />
      )}
    </NetworkDialog>
  );
}

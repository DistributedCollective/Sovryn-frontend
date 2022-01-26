import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isWeb3Wallet } from '@sovryn/wallet';
import { WalletContext } from '@sovryn/react-wallet';
import { translations } from 'locales/i18n';

import { detectWeb3Wallet, capitalize } from '../../../utils/helpers';
import { NetworkDialog } from '../NetworkDialog';
import { DetectionScreen } from './component/DetectionScreen';
import { TutorialScreen } from './component/TutorialScreen';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { getNetworkByChainId } from '../../../utils/blockchain/networks';

export function NetworkRibbon(this: any) {
  const { bridgeChainId } = useSelector(selectWalletProvider);
  const { connected, wallet, chainId, expectedChainId } = useContext(
    WalletContext,
  );
  const location = useLocation();
  const walletName = detectWeb3Wallet();
  const { t } = useTranslation();

  const isOpen = useMemo(() => {
    if (
      !connected ||
      !isWeb3Wallet(wallet.providerType!) ||
      location.pathname.startsWith('/cross-chain') ||
      location.pathname.startsWith('/perpetual')
    )
      return false;

    if (bridgeChainId) return chainId !== bridgeChainId;

    return chainId !== expectedChainId;
  }, [
    bridgeChainId,
    location.pathname,
    connected,
    wallet.providerType,
    chainId,
    expectedChainId,
  ]);

  const targetNetwork = useMemo(() => {
    const chainId = bridgeChainId || expectedChainId;
    if (typeof chainId === 'number') {
      return getNetworkByChainId(chainId);
    }
  }, [bridgeChainId, expectedChainId]);

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
          currentChainId={chainId}
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

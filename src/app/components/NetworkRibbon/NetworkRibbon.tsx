import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';

import { currentChainId } from '../../../utils/classifiers';
import { detectWeb3Wallet } from '../../../utils/helpers';
import { NetworkDialog } from '../NetworkDialog';
import { DetectionScreen } from './component/DetectionScreen';
import { TutorialScreen } from './component/TutorialScreen';

import './_networkRibbon.scss';

export function NetworkRibbon(this: any) {
  const { connected, wallet } = useWalletContext();
  const walletName = detectWeb3Wallet();
  const { t } = useTranslation();

  const getStatus = useCallback(
    () =>
      connected &&
      web3Wallets.includes(wallet.providerType) &&
      wallet.chainId !== currentChainId,
    [connected, wallet],
  );

  const [show, setShow] = useState(getStatus());
  const [startTut, setStart] = useState(false);

  useEffect(() => {
    setShow(getStatus());
  }, [connected, wallet.chainId, wallet.providerType, getStatus]);

  const handleTutDialog = useCallback(() => setStart(true), []);
  const handleBack = useCallback(() => setStart(false), []);

  return (
    <NetworkDialog isOpen={show} className="fw-700" size="normal">
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

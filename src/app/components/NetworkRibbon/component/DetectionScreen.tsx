import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';
import error_alert from '../../../../assets/images/error_outline-24px.svg';
import liquality from '../../../../assets/wallet_icons/liquality.svg';
import metamask from '../../../../assets/wallet_icons/Metamask.svg';
import nifty from '../../../../assets/wallet_icons/nifty.svg';
import { addNetworkByChainId, isAddableNetwork } from 'utils/metamaskHelpers';
import { ActionButton } from 'app/components/Form/ActionButton';

import styles from '../NetworkRibbon.module.scss';
import { capitalize } from '../../../../utils/helpers';
import {
  Network,
  getNetworkByChainId,
} from '../../../../utils/blockchain/networks';

const getWalletLogo = (wallet: string) => {
  switch (wallet) {
    case 'metamask':
      return metamask;
    case 'liquality':
      return liquality;
    case 'nifty':
      return nifty;
  }
};

type DetectionScreenProps = {
  onStart: () => void;
  walletType: string;
  currentChainId?: number;
  network?: Network;
};

export const DetectionScreen: React.FC<DetectionScreenProps> = ({
  onStart,
  walletType,
  currentChainId,
  network,
}) => {
  const { t } = useTranslation();
  const walletName = capitalize(walletType);
  const currentNetwork =
    currentChainId && getNetworkByChainId(currentChainId)?.chain;
  const logo = getWalletLogo(walletType);

  const onAddNetwork = useCallback(
    () => network && addNetworkByChainId(network.chainId),
    [network],
  );

  const { disconnect } = useWalletContext();
  return (
    <>
      <div className="tw-flex tw-my-4 tw-pt-4 sm:tw-pb-12 tw-justify-center tw-flex-row  tw-font-body">
        <div className="tw-mr-2">
          <img src={error_alert} alt="error sign" />
        </div>
        <div className="tw-w-full tw-max-w-5/12 tw-text-warning tw-font-normal tw-text-sm tw-leading-snug tw-normal-case tw-text-left">
          {currentNetwork
            ? t(translations.wrongNetworkDialog.networkAlert, {
                name: currentNetwork,
              })
            : t(translations.wrongNetworkDialog.networkAlertUnknown)}
          <br />
          {t(translations.wrongNetworkDialog.walletAlert, {
            wallet: walletName,
            network:
              network && `${network.chain} ${capitalize(network.network)}`,
          })}
        </div>
      </div>
      <div className="tw-flex tw-mx-4 tw-mb-8 md:tw-mb-12 xl:tw-mb-24 tw-justify-center tw-flex-col sm:tw-flex-row tw-font-body">
        <div className="tw-flex tw-flex-row tw-justify-center tw-items-center logo">
          <img
            alt={`${walletName} logo`}
            src={logo}
            className="tw-text-center"
          />
        </div>
        {walletType === 'metamask' &&
          network &&
          isAddableNetwork(network.chainId) && (
            <div className="tw-flex tw-items-center tw-mt-4 sm:tw-mt-0 sm:tw-ml-12">
              <ActionButton
                text={t(
                  translations.wrongNetworkDialog.metamask.connectButton,
                  { network: network.chain },
                )}
                onClick={onAddNetwork}
                className="tw-block tw-w-full tw-px-9 tw-rounded-lg tw-bg-gray-1 tw-bg-opacity-10"
                textClassName="tw-text-lg tw-tracking-normal tw-leading-6 tw-font-semibold"
                data-action-id="connect-metamask-button"
              />
            </div>
          )}
      </div>
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-center">
        {network && (
          <button onClick={onStart} className={styles.linkButton}>
            {t(translations.wrongNetworkDialog.tutorialGuide, {
              wallet: walletName,
              network: network.chain,
            })}{' '}
          </button>
        )}
        <button className={styles.linkButton} onClick={() => disconnect()}>
          <Icon
            icon="log-out"
            className="tw-text-primary tw-mr-1"
            iconSize={12}
          />{' '}
          {t(translations.wallet.disconnect)}
        </button>
      </div>
    </>
  );
};

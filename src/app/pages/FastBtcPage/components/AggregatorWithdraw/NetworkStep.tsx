import React, { useCallback, useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { WalletContext } from '@sovryn/react-wallet';

import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { NetworkAwareComponentProps } from '../../types';
import { BridgeNetworkDictionary } from 'app/pages/BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { SelectBox } from 'app/pages/BridgeDepositPage/components/SelectBox';
import { getBridgeChainId } from 'app/pages/BridgeDepositPage/utils/helpers';

import networkList from 'utils/blockchain/networks.json';
import styles from 'app/pages/BridgeDepositPage/components/WalletSelector/index.module.scss';
import error_alert from 'assets/images/error_outline-24px.svg';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { detectWeb3Wallet } from 'utils/helpers';
import { ActionButton } from 'app/components/Form/ActionButton';
import {
  addNetwork,
  metamaskDefaultChains,
  switchNetwork,
} from 'utils/metamaskHelpers';

export const NetworkStep: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const { chainId, disconnect } = useContext(WalletContext);
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const chainIdRequired = useMemo(() => getBridgeChainId(network), [network]);

  const chain = useMemo(() => BridgeNetworkDictionary.get(network), [network]);

  const walletName = detectWeb3Wallet();

  const currentNetwork =
    networkList.find(item => item.chainId === chainId)?.chain || 0;

  const changeNetwork = useCallback(() => {
    if (!chain) return;

    const chainId = `0x${chain?.chainId.toString(16)}`;

    if (metamaskDefaultChains.includes(chain?.chainId!)) {
      switchNetwork([
        {
          chainId,
        },
      ]);
    } else {
      addNetwork([
        {
          chainId,
          chainName: chain,
          rpcUrls: [chain.rpc],
          blockExplorerUrls: [chain.explorer],
        },
      ]);
    }
  }, [chain]);

  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
        {t(translations.BridgeDepositPage.chainSelector.chooseNetwork.title)}
      </div>
      <div className="tw-flex tw-px-2 tw-justify-center">
        {chainId !== chainIdRequired && (
          <div>
            <div className={styles.wrongNetwork}>
              <img className="tw-mr-2" src={error_alert} alt="err" />
              <div>
                {t(translations.BridgeDepositPage.walletSelector.wrongNetwork)}{' '}
                <span className="tw-capitalize">{currentNetwork}</span>{' '}
                {t(translations.BridgeDepositPage.walletSelector.switch, {
                  network: chain?.name,
                })}{' '}
                <span className="tw-capitalize">{walletName}</span>{' '}
                {t(translations.BridgeDepositPage.walletSelector.wallet)}
              </div>
            </div>
            <div className="tw-mb-20 tw-mt-10 tw-text-2xl tw-text-center tw-font-semibold">
              {t(
                translations.BridgeDepositPage.chainSelector.wrongNetwork.title,
                { network: chain?.name },
              )}
            </div>
            {bridgeLocked && (
              <ErrorBadge
                content={
                  <Trans
                    i18nKey={translations.maintenance.bridgeSteps}
                    components={[
                      <a
                        href={discordInvite}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                      >
                        x
                      </a>,
                    ]}
                  />
                }
              />
            )}
            <div className="tw-flex tw-flex-col tw-gap-2 tw-px-2 tw-items-center">
              <SelectBox onClick={() => {}}>
                <img
                  className="tw-mb-5 tw-mt-2"
                  src={chain?.logo}
                  alt={chain?.chain}
                />
                <div>
                  <span className="tw-uppercase">{chain?.chain} </span>{' '}
                  {t(translations.BridgeDepositPage.network)}
                </div>
              </SelectBox>

              <a
                href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-cursor-pointer tw-font-light tw-text-primary tw-underline tw-my-2"
              >
                {t(translations.BridgeDepositPage.walletSelector.howToConnect)}{' '}
                <span className="tw-uppercase">{chain?.chain}</span> with{' '}
                <span className="tw-capitalize">{walletName}</span>
              </a>

              {walletName === 'metamask' && (
                <ActionButton
                  className="tw-font-semibold tw-w-80 tw-rounded-xl tw-my-2"
                  text={t(
                    translations.BridgeDepositPage.returnToPortfolio
                      .switchNetwork,
                  )}
                  onClick={changeNetwork}
                />
              )}

              <div
                onClick={() => disconnect()}
                className="tw-cursor-pointer tw-font-semibold tw-text-sov-white tw-underline tw-text-center tw-mt-8"
              >
                {t(translations.BridgeDepositPage.changeWallet)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

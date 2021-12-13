import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletConnectionView, WalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';

import { Chain } from '../../../../../types';
import { getBridgeChainId } from '../../utils/helpers';
import { selectWalletProvider } from '../../../../containers/WalletProvider/selectors';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeNetworkDictionary } from '../../dictionaries/bridge-network-dictionary';
import error_alert from 'assets/images/error_outline-24px.svg';
import { detectWeb3Wallet } from 'utils/helpers';
import { SelectBox } from '../SelectBox';
import { actions } from '../../slice';
import { discordInvite } from 'utils/classifiers';

import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DepositStep } from '../../types';
import { ActionButton } from 'app/components/Form/ActionButton';
import {
  switchNetwork,
  addNetwork,
  metamaskDefaultChains,
} from 'utils/metamaskHelpers';
import styles from './index.module.scss';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { noop } from 'app/constants';
import { getNetworkByChainId } from '../../../../../utils/blockchain/networks';

export const WalletSelector: React.FC = () => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const dispatch = useDispatch();

  const { bridgeChainId, chainId } = useSelector(selectWalletProvider);
  const { chain } = useSelector(selectBridgeDepositPage);

  const walletName = detectWeb3Wallet();

  const walletContext = useContext(WalletContext);
  const currentNetwork = (chainId && getNetworkByChainId(chainId)?.chain) || 0;

  useEffect(() => {
    // Keep injected web3 wallet connected, disconnect all other wallet providers.
    if (walletContext.provider !== ProviderType.WEB3) {
      walletContext.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bridgeChainId) {
      dispatch(actions.setStep(DepositStep.CHAIN_SELECTOR));
    }
  }, [bridgeChainId, dispatch]);

  const state = useMemo(() => {
    if (
      chain !== null &&
      isWeb3Wallet(walletContext.wallet.providerType as ProviderType) &&
      walletContext.wallet.isConnected() &&
      walletContext.wallet.chainId !== getBridgeChainId(chain as Chain)
    ) {
      return 'wrong-network';
    }
    return 'choose-network';
  }, [walletContext, chain]);

  const network = useMemo(() => BridgeNetworkDictionary.get(chain as Chain), [
    chain,
  ]);

  const changeNetwork = useCallback(() => {
    if (!network) return;

    const { chain, rpc, explorer } = network;
    const chainId = `0x${network?.chainId.toString(16)}`;

    if (metamaskDefaultChains.includes(network?.chainId!)) {
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
          rpcUrls: [rpc],
          blockExplorerUrls: [explorer],
        },
      ]);
    }
  }, [network]);

  return (
    <div className={styles.host}>
      {state === 'wrong-network' && (
        <>
          <div className={styles.wrongNetwork}>
            <img className="tw-mr-2" src={error_alert} alt="err" />
            <div>
              {t(translations.BridgeDepositPage.walletSelector.wrongNetwork)}{' '}
              <span className="tw-capitalize">{currentNetwork}</span>{' '}
              {t(translations.BridgeDepositPage.walletSelector.switch, {
                network: network?.name,
              })}{' '}
              <span className="tw-capitalize">{walletName}</span>{' '}
              {t(translations.BridgeDepositPage.walletSelector.wallet)}
            </div>
          </div>
          <div className="tw-mb-20 tw-mt-10 tw-text-2xl tw-text-center tw-font-semibold">
            {t(
              translations.BridgeDepositPage.chainSelector.wrongNetwork.title,
              { network: network?.name },
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
                src={network?.logo}
                alt={network?.chain}
              />
              <div>
                <span className="tw-uppercase">{network?.chain} </span>{' '}
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
              <span className="tw-uppercase">{network?.chain}</span> with{' '}
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
              onClick={() => walletContext.disconnect()}
              className="tw-cursor-pointer tw-font-semibold tw-text-sov-white tw-underline tw-text-center tw-mt-8"
            >
              {t(translations.BridgeDepositPage.changeWallet)}
            </div>
          </div>
        </>
      )}

      {state === 'choose-network' && (
        <>
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
                      className="tw-text-warning tw-center tw-text-xs tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
          <WalletConnectionView
            onStep={noop}
            onCompleted={noop}
            hideInstructionLink={true}
            enableSoftwareWallet={
              process.env.REACT_APP_ENABLE_SOFTWARE_WALLET === 'true'
            }
          />
        </>
      )}
    </div>
  );
};

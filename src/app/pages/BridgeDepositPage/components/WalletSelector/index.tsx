import React, { useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletConnectionView, WalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';

import { Chain } from '../../../../../types';
import { getBridgeChainId } from '../../utils/helpers';
import { selectWalletProvider } from '../../../../containers/WalletProvider/selectors';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeNetworkDictionary } from '../../dictionaries/bridge-network-dictionary';
import styled from 'styled-components/macro';
import networkList from '../../../../components/NetworkRibbon/component/network.json';
import error_alert from 'assets/images/error_outline-24px.svg';
import { detectWeb3Wallet } from 'utils/helpers';
import { SelectBox } from '../SelectBox';
import { actions } from '../../slice';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DepositStep } from '../../types';
import { ActionButton } from 'app/components/Form/ActionButton';
import { switchNetwork } from 'utils/metamaskHelpers';

export function WalletSelector() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ethereum } = window as any;

  const { bridgeChainId } = useSelector(selectWalletProvider);
  const { chain } = useSelector(selectBridgeDepositPage);
  const chainId = parseInt(ethereum.chainId as string);

  const walletName = detectWeb3Wallet();

  const walletContext = useContext(WalletContext);
  const currentNetwork =
    networkList.find(item => item.chainId === chainId)?.chain || 0;

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

  const changeNetwork = () => {
    switchNetwork([
      {
        chainId: `0x${network?.chainId.toString(16)}`,
      },
    ]);
  };

  return (
    <WalletWrapper className="tw-relative tw-p-8">
      {state === 'wrong-network' && (
        <>
          <WrongNetwork className="tw-flex tw-items-center tw-fixed tw-top-4 tw-px-8 tw-py-4 tw-text-sm">
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
          </WrongNetwork>
          <div className="tw-mb-20 tw-mt-10 tw-text-2xl tw-text-center tw-font-semibold">
            {t(
              translations.BridgeDepositPage.chainSelector.wrongNetwork.title,
              { network: network?.name },
            )}
          </div>
          <div className="tw-flex tw-flex-col tw-gap-6 tw-px-2 tw-items-center">
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
              className="tw-cursor-pointer tw-font-light tw-text-gold tw-underline"
            >
              {t(translations.BridgeDepositPage.walletSelector.howToConnect)}{' '}
              <span className="tw-uppercase">{network?.chain}</span> with{' '}
              <span className="tw-capitalize">{walletName}</span>
            </a>

            {walletName === 'metamask' && (
              <ActionButton
                className="tw-font-semibold tw-w-80 tw-rounded-xl"
                text={t(
                  translations.BridgeDepositPage.returnToPortfolio
                    .switchNetwork,
                )}
                onClick={changeNetwork}
              />
            )}

            <div
              onClick={() => walletContext.disconnect()}
              className="tw-cursor-pointer tw-font-semibold tw-text-white tw-underline tw-text-center tw-mt-10"
            >
              {t(translations.BridgeDepositPage.changeWallet)}
            </div>
          </div>
        </>
      )}

      {state === 'choose-network' && (
        <WalletConnectionView
          onStep={step => console.log('step: ', step)}
          onCompleted={step => console.log('step: ', step)}
          hideInstructionLink={true}
          enableSoftwareWallet={
            process.env.REACT_APP_ENABLE_SOFTWARE_WALLET === 'true'
          }
        />
      )}
    </WalletWrapper>
  );
}
export const WalletWrapper = styled.div`
  h1 {
    color: #d9d9d9;
    font-size: 1.5rem;
    text-align: center;
    font-weight: 600 !important;
    font-family: Montserrat, sans-serif !important;
    text-transform: capitalize;
    margin-bottom: 1rem;
  }
`;

export const WrongNetwork = styled.div`
  width: 500px;
  max-width: 90vw;
  background: #e9eae9;
  border: 1px solid #707070;
  border-radius: 10px;
  opacity: 0.75;
  color: #a52222;
  left: 0;
  right: 0;
  margin: auto;
`;

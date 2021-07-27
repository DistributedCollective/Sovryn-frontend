import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWalletContext, WalletConnectionView } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';

import { Icon } from '@blueprintjs/core';
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

interface Props {}

export function WalletSelector(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ethereum } = window as any;

  const { bridgeChainId } = useSelector(selectWalletProvider);
  const { chain } = useSelector(selectBridgeDepositPage);
  const chainId = parseInt(ethereum.chainId as string);

  const walletName = detectWeb3Wallet();

  const walletContext = useWalletContext();
  const currentNetwork =
    networkList.find(item => item.chainId === chainId)?.chain || 0;

  useEffect(() => {
    walletContext.disconnect();
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

  return (
    <WalletWrapper>
      {state === 'wrong-network' && (
        <>
          <WrongNetwork className="tw-flex tw-items-center tw-fixed tw-top-4 tw-px-8 tw-py-4 tw-text-sm">
            <img className="tw-mr-2" src={error_alert} alt="err" />
            <div>
              We detected that you are on{' '}
              <span className="tw-capitalize">{currentNetwork}</span> Please
              switch to {network?.name} in your{' '}
              <span className="tw-capitalize">{walletName}</span> wallet
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
                <span className="tw-uppercase">{network?.chain} </span> Network
              </div>
            </SelectBox>
            <div
              className="tw-cursor-pointer d-flex align-items-center justify-content-center titleTut font-family-montserrat"
              onClick={() => walletContext.disconnect()}
            >
              <Icon
                icon="log-out"
                className="tw-text-gold mr-1"
                iconSize={12}
              />

              {t(translations.wallet.disconnect)}
            </div>

            <a
              href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-cursor-pointer tw-font-light tw-text-gold tw-underline"
            >
              How to connect to{' '}
              <span className="tw-uppercase">{network?.chain}</span> with{' '}
              <span className="tw-capitalize">{walletName}</span>
            </a>
          </div>
        </>
      )}

      {state === 'choose-network' && (
        <WalletConnectionView
          onStep={step => console.log('step: ', step)}
          onCompleted={step => console.log('step: ', step)}
          hideInstructionLink={true}
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
  transform: translateX(100px);
  margin: auto;
`;

/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';

import { actions } from '../../slice';
import { Chain } from '../../../../../types';
import { getBridgeChainId } from '../../utils/helpers';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeNetworkDictionary } from '../../dictionaries/bridge-network-dictionary';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { currentChainId } from '../../../../../utils/classifiers';
import { SelectBox } from '../SelectBox';
import styled from 'styled-components/macro';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import error_alert from 'assets/images/error_outline-24px.svg';

interface Props {}

export function ChainSelector(props: Props) {
  const { chain } = useSelector(selectBridgeDepositPage);
  const dispatch = useDispatch();

  const walletContext = useWalletContext();

  const selectNetwork = useCallback(
    (chain: Chain) => {
      dispatch(actions.selectNetwork({ chain, walletContext }));
    },
    [dispatch, walletContext],
  );

  const state = useMemo(() => {
    if (
      chain !== null &&
      web3Wallets.includes(walletContext.wallet.providerType) &&
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

  // It excludes current dapp chain (no RSK network), but i think it should be there in the end.
  const networks = useMemo(
    () =>
      BridgeDictionary.listNetworks().filter(
        item => item.chainId !== currentChainId,
      ),
    [],
  );

  return (
    <SwitchTransition>
      <CSSTransition
        key={state}
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
        classNames="fade"
      >
        <div>
          {state === 'wrong-network' && (
            <>
              <WrongNetwork className="tw-flex tw-items-center tw-fixed tw-top-4 tw-px-8 tw-py-4 tw-text-sm">
                <img className="tw-mr-2" src={error_alert} alt="err" />
                We detected that you are on Etereum Mainnet Please switch to RSK
                Mainnet in your Metamask wallet
              </WrongNetwork>
              <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
                Change to {network?.name}
              </div>
              <div className="tw-flex tw-flex-col tw-gap-12 tw-px-2 tw-items-center">
                <SelectBox onClick={() => {}}>
                  <img
                    className="tw-mb-5 tw-mt-2"
                    src={network?.logo}
                    alt={network?.chain}
                  />
                  <div>
                    <span className="tw-uppercase">{network?.chain} </span>{' '}
                    Network
                  </div>
                </SelectBox>
                <div className="tw-font-light tw-text-gold tw-underline">
                  How to connect to{' '}
                  <span className="tw-uppercase">{network?.chain}</span> with
                  Metamask
                </div>
              </div>
            </>
          )}

          {state === 'choose-network' && (
            <>
              <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
                Select Network to deposit from
              </div>
              <div className="tw-flex tw-gap-10 tw-px-2 tw-justify-center">
                {networks.map(item => (
                  <SelectBox
                    key={item.chain}
                    onClick={() => selectNetwork(item.chain)}
                  >
                    <img
                      className="tw-mb-5 tw-mt-2"
                      src={item.logo}
                      alt={item.chain}
                    />
                    <div>
                      <span className="tw-uppercase">{item.chain} </span>{' '}
                      Network
                    </div>
                  </SelectBox>
                ))}
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}
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

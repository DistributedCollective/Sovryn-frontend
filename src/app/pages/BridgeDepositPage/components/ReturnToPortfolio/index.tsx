/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useWalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';

import { Chain } from 'types';
import { actions } from '../../slice';
import { Button } from '../../../../components/Button';
import { currentChainId, currentNetwork } from 'utils/classifiers';
import { addRskMainnet, addRskTestnet } from 'utils/metamaskHelpers';
import { SelectBox } from '../SelectBox';
import wMetamask from 'assets/wallets/metamask.svg';
import { detectWeb3Wallet } from 'utils/helpers';

const addNetworkCallback =
  currentNetwork === 'mainnet' ? addRskMainnet : addRskTestnet;

interface Props {}

export function ReturnToPortfolio(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const walletName = detectWeb3Wallet();

  useEffect(() => {
    dispatch(actions.close());
  }, [dispatch]);

  const { wallet, connected, connect } = useWalletContext();

  const handleNetworkSwitch = useCallback(() => {
    dispatch(actions.selectSourceNetwork(Chain.RSK));
  }, [dispatch]);

  // todo: this makes dapp unresponsive sometimes, check for leak in wallet lib.
  // useEffect(() => {
  //   if (wallet.chainId === currentChainId) {
  //     history.push('/wallet');
  //   }
  // }, [history, wallet.chainId]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
        Connect to RSK
      </div>
      {!connected && (
        <>
          <SelectBox onClick={() => {}}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-mw-320 tw-text-center tw-mt-12 tw-mb-5">
            To continue you need to connect to your{' '}
            <span className="tw-capitalize">{walletName}</span>.
          </p>

          <Button
            className="tw-w-full"
            text="Connect Network"
            onClick={() => connect()}
          />
        </>
      )}
      {connected && wallet.chainId !== currentChainId && (
        <>
          <SelectBox onClick={() => {}}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-mw-320 tw-text-center tw-mt-12 tw-mb-5">
            To continue switch back to the RSK network in your{' '}
            <span className="tw-capitalize">{walletName}</span>.
          </p>
          {walletName === 'metamask' && (
            <Button
              className="tw-w-full"
              text="Switch Network"
              onClick={addNetworkCallback}
            />
          )}
          {!isWeb3Wallet(wallet.providerType as ProviderType) && (
            <Button
              className="tw-w-full"
              text="Switch Network"
              onClick={handleNetworkSwitch}
            />
          )}
        </>
      )}

      {wallet.chainId === currentChainId && (
        <>
          <SelectBox onClick={() => {}}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div className="tw-capitalize">{walletName}</div>
          </SelectBox>
          <p className="tw-mw-320 tw-text-center tw-mt-12 tw-mb-5">All Set</p>
          <Button
            className="tw-w-full"
            text="Return to Portfolio"
            onClick={() => history.push('/wallet')}
          />
        </>
      )}
    </div>
  );
}

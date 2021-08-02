import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useWalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';

import { Chain } from 'types';
import { actions } from '../../slice';
import { currentChainId, currentNetwork } from 'utils/classifiers';
import { addRskMainnet, addRskTestnet } from 'utils/metamaskHelpers';
import { SelectBox } from '../SelectBox';
import wMetamask from 'assets/wallets/metamask.svg';
import { detectWeb3Wallet } from 'utils/helpers';
import { noop } from '../../../../constants';
import { ActionButton } from 'app/components/Form/ActionButton';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

const addNetworkCallback =
  currentNetwork === 'mainnet' ? addRskMainnet : addRskTestnet;

export function ReturnToPortfolio() {
  const { t } = useTranslation();
  const trans = translations.BridgeDepositPage.returnToPortfolio;
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

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
      <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold tw-w-80">
        {t(trans.title)}
      </div>
      {!connected && (
        <>
          <SelectBox onClick={noop}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-mw-320 tw-text-center tw-mt-12 tw-mb-5">
            {t(trans.notConnected)}{' '}
            <span className="tw-capitalize">{walletName}</span>.
          </p>

          <ActionButton
            className="tw-font-semibold tw-w-80 tw-rounded-xl"
            text={t(trans.connectNetwork)}
            onClick={() => connect()}
          />
        </>
      )}
      {connected && wallet.chainId !== currentChainId && (
        <>
          <SelectBox onClick={noop}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-mw-320 tw-text-center tw-mt-12 tw-mb-5">
            {t(trans.wrongNetwork)}{' '}
            <span className="tw-capitalize">{walletName}</span>.
          </p>
          {walletName === 'metamask' && (
            <ActionButton
              className="tw-font-semibold tw-w-80 tw-rounded-xl"
              text={t(trans.switchNetwork)}
              onClick={addNetworkCallback}
            />
          )}
          {!isWeb3Wallet(wallet.providerType as ProviderType) && (
            <ActionButton
              className="tw-font-semibold tw-w-80 tw-rounded-xl"
              text={t(trans.switchNetwork)}
              onClick={handleNetworkSwitch}
            />
          )}
        </>
      )}

      {wallet.chainId === currentChainId && (
        <>
          <SelectBox onClick={noop}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div className="tw-capitalize">{walletName}</div>
          </SelectBox>
          <p className="tw-mw-320 tw-text-center tw-mt-12 tw-mb-5">
            {t(trans.connected)}
          </p>

          <ActionButton
            className="tw-font-semibold tw-w-80 tw-rounded-xl"
            text={t(trans.return)}
            onClick={() => history.push('/wallet')}
          />
        </>
      )}
    </div>
  );
}

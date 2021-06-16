/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';

import { Chain } from 'types';
import { actions } from '../../slice';
import { Button } from '../../../../components/Button';
import { currentChainId } from '../../../../../utils/classifiers';

interface Props {}

export function CompleteStep(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.close());
  }, [dispatch]);

  const { wallet } = useWalletContext();

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
    <div>
      <div>
        {wallet.chainId !== currentChainId && (
          <>
            <p>To continue switch back to the RSK network in your wallet.</p>
            {!web3Wallets.includes(wallet.providerType) && (
              <Button text="Switch Network" onClick={handleNetworkSwitch} />
            )}
          </>
        )}

        {wallet.chainId === currentChainId && (
          <>
            <p>All set.</p>
            <Button
              text="To Portfolio"
              onClick={() => history.push('/wallet')}
            />
          </>
        )}
      </div>
    </div>
  );
}

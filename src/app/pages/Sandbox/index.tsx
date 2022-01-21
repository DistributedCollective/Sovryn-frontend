import { WalletContext } from '@sovryn/react-wallet';
import { Button } from 'app/components/Button';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useGsnSendTx } from 'app/hooks/useGsnSendTx';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { useDispatch } from 'react-redux';
import { gasLimit } from '../../../utils/classifiers';
import { actions } from '../../containers/WalletProvider/slice';
import { TxType } from '../../../store/global/transactions-store/types';
import {
  PERPETUAL_GAS_PRICE_DEFAULT,
  PERPETUAL_CHAIN,
  PERPETUAL_CHAIN_ID,
} from '../PerpetualPage/types';
import { useBridgeNetworkSendTx } from '../../hooks/useBridgeNetworkSendTx';
import { Chain } from '../../../types';
import { bridgeNetwork } from '../BridgeDepositPage/utils/bridge-network';
import { useAccount } from '../../hooks/useAccount';
import { BigNumber } from 'ethers';
import { gsnNetwork } from '../../../utils/gsn/GsnNetwork';

const PAYMASTER_ADDRESS = '0x260373ec3d799047FDDD682cCb08A22FF53f227c'.toLowerCase();
const TEST_TOKEN = getContract('PERPETUALS_token');

export const SandboxPage: React.FC = () => {
  const dispatch = useDispatch();
  const { wallet, connect } = useContext(WalletContext);
  const account = useAccount();

  const gsn = useMemo(
    () => gsnNetwork.getProvider(PERPETUAL_CHAIN_ID, PAYMASTER_ADDRESS),
    [],
  );

  const { send: sendNormal, ...normalTx } = useBridgeNetworkSendTx(
    PERPETUAL_CHAIN,
    'PERPETUALS_token',
    'approve',
  );

  const { send, ...tx } = useGsnSendTx(
    PERPETUAL_CHAIN,
    'PERPETUALS_token',
    'approve',
    PAYMASTER_ADDRESS,
  );

  const handleClickApprove = useCallback(() => {
    sendNormal([PAYMASTER_ADDRESS, toWei(1)], {
      gas: gasLimit[TxType.APPROVE],
      gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
    }); // approve tokens to be spend by paymaster
  }, [sendNormal]);

  const handleClickGSN = useCallback(() => {
    send([PAYMASTER_ADDRESS, toWei(10)], {
      gas: gasLimit[TxType.APPROVE],
      gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
    }); // approve tokens to be spend by paymaster
  }, [send]);

  useEffect(() => {
    //set the bridge chain id to BSC
    dispatch(actions.setBridgeChainId(PERPETUAL_CHAIN_ID));
  }, [dispatch]);

  useEffect(() => {
    bridgeNetwork
      .call(Chain.BSC, TEST_TOKEN.address, TEST_TOKEN.abi, 'allowance', [
        account,
        PAYMASTER_ADDRESS,
      ])
      .then(result =>
        console.log('approval', BigNumber.from(result).toString()),
      )
      .catch(console.error);
    bridgeNetwork
      .call(Chain.BSC, TEST_TOKEN.address, TEST_TOKEN.abi, 'balanceOf', [
        account,
      ])
      .then(result => console.log('balance', BigNumber.from(result).toString()))
      .catch(console.error);
  }, [account, normalTx.status]);

  return (
    <>
      <div className="tw-container tw-text-center">
        <p>wallet: {wallet.address}</p>
        {wallet.connected ? (
          <>
            <Button onClick={handleClickApprove} text="Approve Paymaster" />
            <p>
              {normalTx.txHash}: {normalTx.status}
            </p>
            <Button
              onClick={handleClickGSN}
              loading={!gsn.isReady}
              disabled={!gsn.isReady}
              text="Approve 10 PERPETUAL TEST TOKENS"
            />
            <p>
              {tx.txHash}: {tx.status}
            </p>
            {!gsn.isReady && <p>Please wait, initializing gsn provider.</p>}
          </>
        ) : (
          <button onClick={connect}>Connect wallet</button>
        )}
      </div>
      <TxDialog tx={tx} />
    </>
  );
};

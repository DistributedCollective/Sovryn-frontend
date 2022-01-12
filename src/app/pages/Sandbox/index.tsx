import { WalletContext } from '@sovryn/react-wallet';
import { Button } from 'app/components/Button';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useSendToGsnContractAddressTx } from 'app/hooks/useSendToGsnContractAddressTx';
import React, { useCallback, useContext, useEffect } from 'react';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { GsnWrapper } from 'utils/gsn/GsnWrapper';
import { useDispatch } from 'react-redux';
import { gasLimit } from '../../../utils/classifiers';
import { actions } from '../../containers/WalletProvider/slice';
import { TxType } from '../../../store/global/transactions-store/types';
import {
  PERPETUAL_GAS_PRICE_DEFAULT,
  PERPETUAL_CHAIN_ID,
} from '../PerpetualPage/types';

const PAYMASTER_ADDRESS = '0xE948a50Fbfa6b6e05f1A76A2A37A3DF516e2D4B5'.toLowerCase();
const TEST_TOKEN = getContract('PERPETUALS_token').address; // weenus token on rinkeby

const gsn = new GsnWrapper(PERPETUAL_CHAIN_ID, PAYMASTER_ADDRESS);

export const SandboxPage: React.FC = () => {
  const dispatch = useDispatch();
  const { wallet, connect } = useContext(WalletContext);

  const token = getContract('PERPETUALS_token'); // only using to get erc20 abi
  const { send, ...tx } = useSendToGsnContractAddressTx(
    PERPETUAL_CHAIN_ID,
    PAYMASTER_ADDRESS,
    TEST_TOKEN,
    token.abi,
    'approve',
  );

  const handleClick = useCallback(() => {
    send([PAYMASTER_ADDRESS, toWei(10)], {
      gas: gasLimit[TxType.APPROVE],
      gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
    }); // approve tokens to be spend by paymaster
  }, [send]);

  useEffect(() => {
    //set the bridge chain id to BSC
    dispatch(actions.setBridgeChainId(PERPETUAL_CHAIN_ID));
  }, [dispatch]);

  return (
    <>
      <div className="tw-container tw-text-center">
        <p>wallet: {wallet.address}</p>
        {wallet.connected ? (
          <>
            <Button
              onClick={handleClick}
              loading={!gsn.isReady}
              disabled={!gsn.isReady}
              text="Approve 10 PERPETUAL TEST TOKENS"
            />
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

import { WalletContext } from '@sovryn/react-wallet';
import { Button } from 'app/components/Button';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useSendToGsnContractAddressTx } from 'app/hooks/useSendToGsnContractAddressTx';
import React, { useCallback, useContext, useEffect } from 'react';
import { ChainId } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { GsnWrapper } from 'utils/gsn/GsnWrapper';
import { useDispatch } from 'react-redux';
import { isMainnet } from '../../../utils/classifiers';
import { actions } from '../../containers/WalletProvider/slice';

const PAYMASTER_ADDRESS = '0x0d78BFb1E07737C24fB21F27e430e129e0f89A05'.toLowerCase();
const TEST_TOKEN = '0x8389b185D40293b080e27794694704F98aD50f5A'.toLowerCase(); // weenus token on rinkeby

const gsn = new GsnWrapper(ChainId.BSC_TESTNET, PAYMASTER_ADDRESS);

export const SandboxPage: React.FC = () => {
  const dispatch = useDispatch();
  const { wallet, connect } = useContext(WalletContext);

  const token = getContract('PERPETUALS_token'); // only using to get erc20 abi
  const { send, ...tx } = useSendToGsnContractAddressTx(
    ChainId.BSC_TESTNET,
    PAYMASTER_ADDRESS,
    TEST_TOKEN,
    token.abi,
    'approve',
  );

  const handleClick = useCallback(() => {
    send([PAYMASTER_ADDRESS, toWei(10)]); // approve tokens to be spend by paymaster
  }, [send]);

  useEffect(() => {
    //set the bridge chain id to BSC
    dispatch(
      actions.setBridgeChainId(
        isMainnet ? ChainId.BSC_MAINNET : ChainId.BSC_TESTNET,
      ),
    );
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

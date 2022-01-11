import { WalletContext } from '@sovryn/react-wallet';
import { Button } from 'app/components/Button';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useSendToGsnContractAddressTx } from 'app/hooks/useSendToGsnContractAddressTx';
import React, { useCallback, useContext } from 'react';
import { ChainId } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { GsnWrapper } from 'utils/gsn/GsnWrapper';

const PAYMASTER_ADDRESS = '0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016'.toLowerCase();
const TEST_TOKEN = '0xaFF4481D10270F50f203E0763e2597776068CBc5'.toLowerCase(); // weenus token on rinkeby

const gsn = new GsnWrapper(ChainId.ETH_RINKEBY, PAYMASTER_ADDRESS);

export const SandboxPage: React.FC = () => {
  const { wallet, connect } = useContext(WalletContext);

  const sov = getContract('SOV_token'); // only using to get erc20 abi
  const { send, ...tx } = useSendToGsnContractAddressTx(
    ChainId.ETH_RINKEBY,
    PAYMASTER_ADDRESS,
    TEST_TOKEN,
    sov.abi,
    'approve',
  );

  const handleClick = useCallback(() => {
    send([PAYMASTER_ADDRESS, toWei(10)]); // approve tokens to be spend by paymaster
  }, [send]);

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
              text="Approve 10 WEENUS tokens"
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

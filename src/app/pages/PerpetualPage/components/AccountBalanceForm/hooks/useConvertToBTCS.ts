import { useAccount } from 'app/hooks/useAccount';
import { useBridgeNetworkSendTx } from 'app/hooks/useBridgeNetworkSendTx';
import { useGsnCheckAndApprove } from 'app/hooks/useGsnCheckAndApprove';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { TxType } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { PERPETUAL_CHAIN, PERPETUAL_PAYMASTER } from '../../../types';

export const useConvertToBTCS = () => {
  const account = useAccount();

  const { checkAndApprove } = useGsnCheckAndApprove(
    PERPETUAL_CHAIN,
    'BTCB_token',
    PERPETUAL_PAYMASTER,
    false,
    Asset.BTCB,
  );

  const { send, ...txData } = useBridgeNetworkSendTx(
    PERPETUAL_CHAIN,
    'Masset_proxy',
    'mint',
  );

  return {
    send: async (weiAmount: string) => {
      let nonce = await bridgeNetwork.nonce(PERPETUAL_CHAIN);

      const result = await checkAndApprove(
        getContract('Masset_proxy').address,
        weiAmount,
      );

      if (result.rejected) {
        return;
      }

      nonce += 1;

      await send([getContract('BTCB_token').address, weiAmount], {
        nonce,
        from: account,
        gas: gasLimit[TxType.CONVERT_BTCB],
      });
    },
    ...txData,
  };
};

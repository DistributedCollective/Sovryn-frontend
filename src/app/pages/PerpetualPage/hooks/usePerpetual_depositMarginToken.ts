import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { PERPETUAL_ID, floatToABK64x64 } from '../utils/contractUtils';
import { fromWei } from 'utils/blockchain/math-helpers';

export const usePerpetual_depositMarginToken = () => {
  const account = useAccount();

  const { send, ...rest } = useSendContractTx('perpetualManager', 'deposit');

  return {
    deposit: async (amount: string, nonce?: number) => {
      await send(
        [PERPETUAL_ID, floatToABK64x64(parseFloat(fromWei(amount)))],
        {
          from: account,
          gas: gasLimit[TxType.DEPOSIT_COLLATERAL],
          nonce: nonce,
        },
        { type: TxType.DEPOSIT_COLLATERAL },
      );
    },
    txData: rest.txData,
    txHash: rest.txHash,
    loading: rest.loading,
    status: rest.status,
    reset: rest.reset,
  };
};

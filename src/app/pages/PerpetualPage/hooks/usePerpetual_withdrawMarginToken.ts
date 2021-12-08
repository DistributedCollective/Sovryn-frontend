import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { PERPETUAL_ID, weiToABK64x64 } from '../utils/contractUtils';

export const usePerpetual_withdrawMarginToken = () => {
  const account = useAccount();

  const { send, ...rest } = useSendContractTx('perpetualManager', 'withdraw');

  return {
    withdraw: async (amount: string, nonce?: number) => {
      send(
        [PERPETUAL_ID, weiToABK64x64(amount)],
        {
          from: account,
          gas: gasLimit[TxType.WITHDRAW_COLLATERAL],
          nonce,
        },
        { type: TxType.WITHDRAW_COLLATERAL },
      );
    },
    txData: rest.txData,
    txHash: rest.txHash,
    loading: rest.loading,
    status: rest.status,
    reset: rest.reset,
  };
};

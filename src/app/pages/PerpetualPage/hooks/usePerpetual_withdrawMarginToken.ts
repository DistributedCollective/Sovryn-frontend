import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { PERPETUAL_ID, floatToABK64x64 } from '../utils';

export const usePerpetual_withdrawMarginToken = () => {
  const account = useAccount();

  const { send, ...rest } = useSendContractTx('perpetualManager', 'withdraw');

  return {
    withdraw: async (amount: string) => {
      send(
        [PERPETUAL_ID, floatToABK64x64(parseFloat(amount))],
        {
          from: account,
          gas: gasLimit[TxType.DEPOSIT_COLLATERAL],
        },
        { type: TxType.DEPOSIT_COLLATERAL },
      );
    },
    ...rest,
  };
};

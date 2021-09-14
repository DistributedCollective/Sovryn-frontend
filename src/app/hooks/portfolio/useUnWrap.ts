import { useAccount } from '../useAccount';
import { useSendContractTx } from '../useSendContractTx';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from '../../../utils/classifiers';

export const useUnWrap = () => {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('WRBTC_token', 'withdraw');

  return {
    convert: async (weiAmount: string) => {
      send(
        [weiAmount],
        {
          from: account,
          gas: gasLimit[TxType.UNWRAP_WRBTC],
        },
        {
          type: TxType.UNWRAP_WRBTC,
        },
      );
    },
    ...rest,
  };
};

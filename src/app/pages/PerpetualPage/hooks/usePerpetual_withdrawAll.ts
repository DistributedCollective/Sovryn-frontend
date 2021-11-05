import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import { PERPETUAL_ID } from '../utils';

export const usePerpetual_withdrawAll = () => {
  const account = useAccount();

  const { send, ...rest } = useSendContractTx(
    'perpetualManager',
    'withdrawAll',
  );

  return {
    withdraw: async () => {
      send(
        [PERPETUAL_ID],
        {
          from: account,
          gas: gasLimit[TxType.WITHDRAW_COLLATERAL],
        },
        { type: TxType.WITHDRAW_COLLATERAL },
      );
    },
    ...rest,
  };
};

import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from '../../../utils/classifiers';

export function useStakeWithdraw() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('staking', 'withdraw');
  return {
    withdraw: (weiAmount: string, timestamp: number) => {
      send(
        [weiAmount, timestamp, account],
        { from: account, gas: gasLimit[TxType.STAKING_WITHDRAW] },
        {
          type: TxType.STAKING_WITHDRAW,
        },
      );
    },
    ...rest,
  };
}

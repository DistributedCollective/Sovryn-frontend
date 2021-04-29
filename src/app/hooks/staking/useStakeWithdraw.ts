import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useStakeWithdraw() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('staking', 'withdraw');
  return {
    withdraw: (weiAmount: string, timestamp: number) => {
      send(
        [weiAmount, timestamp, account],
        { from: account },
        {
          type: TxType.WITHDRAW,
        },
      );
    },
    ...rest,
  };
}

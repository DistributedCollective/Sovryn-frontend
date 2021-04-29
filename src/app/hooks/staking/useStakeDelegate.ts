import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useStakeDelegate() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('staking', 'delegate');
  return {
    delegate: (address: string, lockDate: number) => {
      send(
        [address, lockDate],
        { from: account },
        {
          type: TxType.DELEGATE,
        },
      );
    },
    ...rest,
  };
}

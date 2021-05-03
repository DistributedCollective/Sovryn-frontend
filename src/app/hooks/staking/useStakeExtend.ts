import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useStakeExtend() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'staking',
    'extendStakingDuration',
  );
  return {
    extend: (prevTimestamp: number, timestamp: number) => {
      send(
        [prevTimestamp, timestamp + 86400],
        { from: account },
        {
          type: TxType.STAKING_EXTEND,
        },
      );
    },
    ...rest,
  };
}

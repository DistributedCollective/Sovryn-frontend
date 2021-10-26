import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';

export function useStakeExtend() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'staking',
    'extendStakingDuration',
  );
  return {
    extend: (prevTimestamp: number, timestamp: number) => {
      send(
        [prevTimestamp, timestamp],
        {
          from: account,
          gas: gasLimit[TxType.STAKING_EXTEND],
        },
        {
          type: TxType.STAKING_EXTEND,
        },
      );
    },
    ...rest,
  };
}

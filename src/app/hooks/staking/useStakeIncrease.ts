import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';

export function useStakeIncrease() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('staking', 'stake');
  return {
    increase: (weiAmount?: string, timestamp?: number, nonce?: number) => {
      send(
        [weiAmount, timestamp, account, ethGenesisAddress],
        {
          from: account,
          nonce: nonce,
          gas: gasLimit[TxType.STAKING_INCREASE_STAKE],
        },
        {
          type: TxType.STAKING_STAKE,
        },
      );
    },
    ...rest,
  };
}

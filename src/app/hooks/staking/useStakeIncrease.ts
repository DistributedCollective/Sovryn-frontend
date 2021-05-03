import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { ethGenesisAddress } from 'utils/classifiers';

export function useStakeIncrease() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('staking', 'stake');
  return {
    increase: (weiAmount?: string, timestamp?: number, nonce?: number) => {
      send(
        [weiAmount, timestamp, account, ethGenesisAddress],
        { from: account, nonce: nonce, gas: 250000 },
        {
          type: TxType.STAKING_STAKE,
        },
      );
    },
    ...rest,
  };
}

import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { useAccount } from 'app/hooks/useAccount';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';

export const useClaimRewardSov = () => {
  const address = useAccount();

  const { send, ...tx } = useSendContractTx(
    'liquidityMiningProxy',
    'claimRewardFromAllPools',
  );

  return {
    send: async () => {
      await send(
        [ethGenesisAddress],
        {
          from: address,
          gas: gasLimit[TxType.CLAIM_VESTED_SOV_REWARDS],
        },
        {
          type: TxType.CLAIM_VESTED_SOV_REWARDS,
        },
      );
    },
    ...tx,
  };
};

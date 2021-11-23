import { contractReader } from 'utils/sovryn/contract-reader';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { useAccount } from 'app/hooks/useAccount';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';

export const useClaimRewardSov = (
  hasLockedSov: boolean,
  hasLMRewards: boolean,
) => {
  const address = useAccount();

  const { send: sendLocked } = useSendContractTx(
    'lockedSov',
    'createVestingAndStake',
  );

  const { send, ...tx } = useSendContractTx(
    'liquidityMiningProxy',
    'claimRewardFromAllPools',
  );

  return {
    send: async () => {
      let nonce = await contractReader.nonce(address);
      if (hasLockedSov) {
        await sendLocked(
          [],
          {
            nonce,
            from: address,
            gas: gasLimit[TxType.LOCKED_SOV_CLAIM],
          },
          {
            type: TxType.LOCKED_SOV_CLAIM,
          },
        );
        nonce++;
      }

      if (hasLMRewards) {
        await send(
          [ethGenesisAddress],
          {
            nonce,
            from: address,
            gas: gasLimit[TxType.CLAIM_VESTED_SOV_REWARDS],
          },
          {
            type: TxType.CLAIM_VESTED_SOV_REWARDS,
          },
        );
      }
    },
    ...tx,
  };
};

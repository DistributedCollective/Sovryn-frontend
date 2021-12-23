import { contractReader } from 'utils/sovryn/contract-reader';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { useAccount } from 'app/hooks/useAccount';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { useMemo } from 'react';

export const useClaimRewardSov = (
  hasLockedSov: boolean,
  hasLMRewards: boolean,
) => {
  const address = useAccount();

  const { send: sendLocked, ...tx1 } = useSendContractTx(
    'lockedSov',
    'createVestingAndStake',
  );

  const { send, ...tx2 } = useSendContractTx(
    'liquidityMiningProxy',
    'claimRewardFromAllPools',
  );

  const tx = useMemo(() => (tx2 && tx2.status !== TxStatus.NONE ? tx2 : tx1), [
    tx1,
    tx2,
  ]);

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

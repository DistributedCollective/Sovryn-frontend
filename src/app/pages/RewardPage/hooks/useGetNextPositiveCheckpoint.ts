import { useAccount } from 'app/hooks/useAccount';
import { useCallback, useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';

const MAX_NEXT_POSITIVE_CHECKPOINT = 75;

type UserCheckpoint = {
  checkpointNum: string;
  hasFees: boolean;
  hasSkippedCheckpoints: boolean;
};

export const useGetNextPositiveCheckpoint = (
  contractAddress: string,
  totalTokenCheckpoints: number,
) => {
  const address = useAccount();
  const [userCheckpoint, setUserCheckpoint] = useState<UserCheckpoint>();

  const updateNextPositiveCheckpoint = useCallback(async () => {
    let index = 1;

    while (index < 5) {
      const checkpoint = await contractReader.call<UserCheckpoint>(
        'feeSharingProxy',
        'getNextPositiveUserCheckpoint',
        [
          address,
          contractAddress,
          MAX_NEXT_POSITIVE_CHECKPOINT * (index - 1),
          MAX_NEXT_POSITIVE_CHECKPOINT * index,
        ],
      );

      if (
        !!checkpoint.hasFees ||
        totalTokenCheckpoints < MAX_NEXT_POSITIVE_CHECKPOINT * index
      ) {
        return setUserCheckpoint({
          checkpointNum: checkpoint.checkpointNum,
          hasFees: checkpoint.hasFees,
          hasSkippedCheckpoints: checkpoint.hasSkippedCheckpoints,
        });
      }
      index++;
    }

    setUserCheckpoint({
      checkpointNum: '0',
      hasFees: false,
      hasSkippedCheckpoints: false,
    });
  }, [address, contractAddress, totalTokenCheckpoints]);

  useEffect(() => {
    if (totalTokenCheckpoints >= 0) {
      updateNextPositiveCheckpoint();
    }
  }, [updateNextPositiveCheckpoint, totalTokenCheckpoints]);

  return { userCheckpoint, updateNextPositiveCheckpoint };
};

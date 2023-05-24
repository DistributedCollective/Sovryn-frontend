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

    while (
      totalTokenCheckpoints >=
      MAX_NEXT_POSITIVE_CHECKPOINT * (index - 1)
    ) {
      const {
        hasFees,
        checkpointNum,
        hasSkippedCheckpoints,
      } = await contractReader.call<UserCheckpoint>(
        'feeSharingProxy',
        'getNextPositiveUserCheckpoint',
        [
          address,
          contractAddress,
          MAX_NEXT_POSITIVE_CHECKPOINT * (index - 1),
          MAX_NEXT_POSITIVE_CHECKPOINT * index,
        ],
      );

      if (!!hasFees) {
        return setUserCheckpoint({
          checkpointNum,
          hasFees,
          hasSkippedCheckpoints,
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

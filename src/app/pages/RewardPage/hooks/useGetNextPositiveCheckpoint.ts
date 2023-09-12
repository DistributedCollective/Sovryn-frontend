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
    const processedCheckpoints = await contractReader.call<number>(
      'feeSharingProxy',
      'processedCheckpoints',
      [address, contractAddress],
    );

    let userNextUnprocessedCheckpoint = processedCheckpoints;

    while (userNextUnprocessedCheckpoint < totalTokenCheckpoints) {
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
          userNextUnprocessedCheckpoint,
          MAX_NEXT_POSITIVE_CHECKPOINT,
        ],
      );

      userNextUnprocessedCheckpoint = Number(checkpointNum);

      if (!!hasFees) {
        return setUserCheckpoint({
          checkpointNum,
          hasFees,
          hasSkippedCheckpoints,
        });
      }
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

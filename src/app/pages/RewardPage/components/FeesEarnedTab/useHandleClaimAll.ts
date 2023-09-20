import { useCallback, useMemo } from 'react';
import { BigNumber } from 'ethers';
import { IEarnedFee } from '../../hooks/useGetFeesEarnedClaimAmount';
import {
  ResetTxResponseInterface,
  useSendContractTx,
} from 'app/hooks/useSendContractTx';
import { useAccount } from 'app/hooks/useAccount';
import { contractReader } from 'utils/sovryn/contract-reader';
import { Asset } from 'types';
import { toastError } from 'utils/toaster';

const MAX_CHECKPONTS = 10;
const MAX_NEXT_POSITIVE_CHECKPOINT = 75;

type HandleClaimAllResult = [ResetTxResponseInterface, () => void];

export const useHandleClaimAll = (fees: IEarnedFee[]): HandleClaimAllResult => {
  const account = useAccount();
  const { send, ...tx } = useSendContractTx(
    'feeSharingProxy',
    'withdrawStartingFromCheckpoints',
  );

  const claimable = useMemo(
    () =>
      fees.filter(
        fee => BigNumber.from(fee.value).gt(0) && (fee.startFrom || 0 > 1),
      ),
    [fees],
  );

  const handleClaim = useCallback(async () => {
    const checkpoints = await Promise.all(
      claimable.map(fee =>
        getNextPositiveCheckpoint(account, fee).then(result => ({
          ...fee,
          startFrom: result.checkpointNum,
          hasSkippedCheckpoints: result.hasSkippedCheckpoints,
          hasFees: result.hasFees,
        })),
      ),
    ).then(result => result.filter(fee => fee.hasSkippedCheckpoints));

    if (checkpoints.length === 0) {
      // todo: use translation key
      toastError(
        'No available fees to claim. Please wait for the next checkpoint.',
        'claim-all',
      );
      return;
    }

    send(
      [
        claimable.map(fee => fee.contractAddress),
        claimable.map(fee => fee.startFrom),
        MAX_CHECKPONTS,
        account,
      ],
      {
        gas: 5_000_000, // todo: move to constants
      },
    );

    // withdrawStartingFromCheckpoints
  }, [claimable, send, account]);
  return [tx, handleClaim];
};

type UserCheckpoint = {
  asset: Asset;
  checkpointNum: number;
  hasFees: boolean;
  hasSkippedCheckpoints: boolean;
};

async function getNextPositiveCheckpoint(
  owner: string,
  fee: IEarnedFee,
): Promise<UserCheckpoint> {
  let userNextUnprocessedCheckpoint = fee.startFrom || 0;
  while (userNextUnprocessedCheckpoint < (fee.maxCheckpoints || 0)) {
    const {
      hasFees,
      checkpointNum,
      hasSkippedCheckpoints,
    } = await contractReader.call<UserCheckpoint>(
      'feeSharingProxy',
      'getNextPositiveUserCheckpoint',
      [
        owner,
        fee.contractAddress,
        userNextUnprocessedCheckpoint,
        MAX_NEXT_POSITIVE_CHECKPOINT,
      ],
    );

    userNextUnprocessedCheckpoint = Number(checkpointNum);

    if (!!hasFees) {
      return {
        asset: fee.asset,
        checkpointNum: Number(checkpointNum),
        hasFees,
        hasSkippedCheckpoints,
      };
    }
  }

  return {
    asset: fee.asset,
    checkpointNum: 0,
    hasFees: false,
    hasSkippedCheckpoints: false,
  };
}

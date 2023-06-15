import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { Asset } from 'types';
import { ContractName } from 'utils/types/contracts';
import { useGetNextPositiveCheckpoint } from './useGetNextPositiveCheckpoint';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useMemo } from 'react';
import { useAccount } from 'app/hooks/useAccount';

const MAX_PROCESSABLE_CHECKPOINTS_TOKENS = 300;

export const useGetTokenCheckpoints = (asset: Asset) => {
  const account = useAccount();
  const {
    value: maxCheckpoints,
    loading: maxCheckpointsLoading,
  } = useCacheCallWithValue(
    'feeSharingProxy',
    'totalTokenCheckpoints',
    -1,
    account ? getContract(`${asset}_token` as ContractName).address : null,
  );

  const { userCheckpoint } = useGetNextPositiveCheckpoint(
    account ? getContract(`${asset}_token` as ContractName).address : '',
    Number(maxCheckpoints),
  );

  const maxWithdrawCheckpoint = useMemo(() => {
    if (!userCheckpoint || !maxCheckpoints || maxCheckpointsLoading) {
      return 0;
    }

    return Number(maxCheckpoints) > MAX_PROCESSABLE_CHECKPOINTS_TOKENS
      ? MAX_PROCESSABLE_CHECKPOINTS_TOKENS
      : Number(maxCheckpoints);
  }, [userCheckpoint, maxCheckpoints, maxCheckpointsLoading]);

  return {
    userCheckpoint,
    maxWithdrawCheckpoint,
  };
};

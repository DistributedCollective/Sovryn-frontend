import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetFeeWithdrawnQuery } from 'utils/graphql/rsk/generated';

export const useGetFeesEarnedEvents = () => {
  const account = useAccount();

  return useGetFeeWithdrawnQuery({
    variables: {
      user: account.toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};

export const getFeesEarnedAsset = token =>
  assetByTokenAddress(token || '') || Asset.RBTC;

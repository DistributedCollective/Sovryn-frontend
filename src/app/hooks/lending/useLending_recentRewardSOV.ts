import { useEffect, useState } from 'react';

import { useLiquidityMining_getPoolId } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getPoolId';
import { useLiquidityMining_getUserInfoList } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserInfoList';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { Asset } from 'types';

export function useLending_recentRewardSOV(asset: Asset) {
  const [recentReward, setRecentReward] = useState('0');
  const {
    value: userInfoList,
    loading: userInfoListLoading,
  } = useLiquidityMining_getUserInfoList();
  const {
    value: poolID,
    loading: poolIDLoading,
  } = useLiquidityMining_getPoolId(getLendingContract(asset)?.address);

  useEffect(() => {
    if (
      userInfoListLoading === false &&
      poolIDLoading === false &&
      userInfoList &&
      userInfoList[poolID] &&
      userInfoList[poolID][2]
    ) {
      setRecentReward(userInfoList[poolID][2]);
    } else setRecentReward('0');
  }, [userInfoList, poolID, userInfoListLoading, poolIDLoading]);

  return recentReward;
}

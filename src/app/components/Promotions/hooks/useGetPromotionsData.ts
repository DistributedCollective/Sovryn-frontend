import { useFetch } from 'app/hooks/useFetch';
import React, { useEffect } from 'react';
import { ammServiceUrl, currentChainId } from 'utils/classifiers';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { useGetLiquidityMiningAllocationPointsQuery } from 'utils/graphql/rsk/generated';
import { PromotionColor } from '../components/PromotionCard/types';
import { getAmmHistory } from '../components/PromotionCard/utils';
import {
  PromotionsDataResponse,
  PromotionData,
  PLACEHOLDER_PROMOTION,
  BLOCKS_PER_WEEK,
  MINIMUM_REWARD,
} from '../types';

export const useGetPromotionsData = (): PromotionsDataResponse => {
  const { value: ammData } = useFetch(`${ammServiceUrl[currentChainId]}/amm`);

  const [promotionData, setPromotionData] = React.useState<PromotionData[]>([]);

  const { data, loading } = useGetLiquidityMiningAllocationPointsQuery();

  useEffect(() => {
    if (data && !loading) {
      const promotionData: PromotionData[] = data.liquidityMiningAllocationPoints.map(
        item => {
          let rewardAmount = Math.floor(
            parseFloat(item.rewardPerBlock) * BLOCKS_PER_WEEK,
          );
          const pool = LiquidityPoolDictionary.get(item.id); // TODO: Needs to be adjusted in the future if we want to dynamically display Lending promotions as well

          // We need to round rewards to the nearest 100
          if (rewardAmount % 100 !== 0) {
            const remainder = rewardAmount % 100;

            if (remainder < 50) {
              rewardAmount = rewardAmount - remainder;
            } else {
              rewardAmount = rewardAmount + (100 - remainder);
            }
          }

          if (!pool) {
            return PLACEHOLDER_PROMOTION;
          }

          return {
            rewardAmount,
            type: 'AMM', // TODO: Needs to be adjusted in the future if we want to dynamically display Lending promotions as well
            poolTokenA: item.id,
            promotionColor:
              (pool.lootDropColor as PromotionColor) || PromotionColor.Blue,
            asset1: pool.assetA,
            asset2: pool.assetB,
            linkAsset: pool.key,
            ammData: getAmmHistory(ammData, pool.assetA, pool.assetB),
          };
        },
      );

      const filteredPromotionData = promotionData.filter(
        item => item.rewardAmount >= MINIMUM_REWARD && item.poolTokenA !== '',
      );

      if (filteredPromotionData.length > 0) {
        setPromotionData(
          filteredPromotionData.sort((a, b) => b.rewardAmount - a.rewardAmount),
        );
      }
    }
  }, [ammData, data, loading]);

  return { data: promotionData, loading };
};

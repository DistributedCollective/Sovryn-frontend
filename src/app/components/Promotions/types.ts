import { AmmHistory } from 'app/pages/LiquidityMining/components/MiningPool/types';
import { Asset } from 'types';
import { PromotionColor } from './components/PromotionCard/types';

export const BLOCKS_PER_WEEK = 20160;
export const MINIMUM_REWARD = 500;

export type PromotionData = {
  rewardAmount: number;
  type: 'AMM' | 'LENDING';
  poolTokenA: string;
  promotionColor: PromotionColor;
  asset1: Asset;
  asset2?: Asset;
  linkAsset?: string;
  ammData: AmmHistory;
};

export const PLACEHOLDER_PROMOTION: PromotionData = {
  rewardAmount: 0,
  type: 'AMM',
  poolTokenA: '',
  promotionColor: PromotionColor.Blue,
  asset1: Asset.SOV,
  ammData: {
    pool: '',
    data: {},
    balanceHistory: [],
  },
  linkAsset: '',
};

export type PromotionsDataResponse = {
  data: PromotionData[];
  loading: boolean;
};

import { bignumber } from 'mathjs';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import {
  RewardsEarnedHistoryItemsFieldsFragment,
  StakeHistoryItemsFieldsFragment,
} from 'utils/graphql/rsk/generated';

export const lendingPools = LendingPoolDictionary.list().map(value =>
  value.getAssetDetails().lendingContract.address.toLowerCase(),
);
// note: original implementation by soulBit took only primary pool token (ignored secondary token for v2 pool),
// leave only list().map(item => item.poolTokenA) to rollback to that.
export const liquidityPools = [
  ...LiquidityPoolDictionary.list().map(item => item.poolTokenA),
  LiquidityPoolDictionary.list()
    .filter(item => item.converterVersion === 2 && item.poolTokenB)
    .map(item => item.poolTokenB),
];

export const sumRewards = (
  items: (
    | StakeHistoryItemsFieldsFragment
    | RewardsEarnedHistoryItemsFieldsFragment
  )[],
) =>
  items.reduce(
    (previousItem, currentItem) => previousItem.add(currentItem?.amount || 0),
    bignumber(0),
  );

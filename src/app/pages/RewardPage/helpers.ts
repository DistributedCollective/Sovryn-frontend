import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { currentNetwork } from 'utils/classifiers';

export const lendingPools = LendingPoolDictionary.list().map(value =>
  value.getAssetDetails().lendingContract.address.toLowerCase(),
);

export const liquidityPools = LiquidityPoolDictionary.list().map(pool =>
  pool.supplyAssets[0].poolTokens[currentNetwork].toLowerCase(),
);

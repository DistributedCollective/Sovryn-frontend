import { Asset, ChainId } from 'types';
import { BlockedPoolConfig } from './types';

export const BLOCKED_POOLS: BlockedPoolConfig[] = [
  // Example for testnet:
  {
    assetA: Asset.SOV,
    chainId: ChainId.RSK_TESTNET,
    message: 'This pool is blocked for testing purposes.',
  },
];
